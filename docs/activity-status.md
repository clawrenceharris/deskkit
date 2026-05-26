# Activity Status System

This guide explains how real-time user activity statuses work in Deskitt. It uses **WebSockets** for live updates and **Redis** for fast, shared state.

---

## What problem does this solve?

When you see a green dot on someone's avatar, that status must:

1. Update **immediately** when they connect, disconnect, or change status
2. Be **shared** across all users viewing the same desk
3. Support **manual overrides** (e.g. "Do Not Disturb for 1 hour")
4. **Expire** manual statuses after a chosen duration

A database alone is too slow for live presence. WebSockets + Redis solve this.

---

## Architecture overview

```
┌─────────────┐     WebSocket      ┌──────────────────┐
│   Browser   │◄──────────────────►│  Presence Server │
│  (React)    │   ws://localhost   │  (Node + ws)     │
└──────┬──────┘       :3001         └────────┬─────────┘
       │                                     │
       │ Server Actions                      │ read/write
       ▼                                     ▼
┌─────────────┐                       ┌─────────────┐
│   Next.js   │                       │    Redis    │
│  (actions)  │──────────────────────►│  (in-memory │
└──────┬──────┘                       │   store)    │
       │                              └──────┬──────┘
       │ Prisma                            │ pub/sub
       ▼                                     │
┌─────────────┐                              │
│  PostgreSQL │◄─────────────────────────────┘
│  (Profile)  │   durable manual status backup
└─────────────┘
```

### Why both Redis and PostgreSQL?

| Store | Role |
|-------|------|
| **Redis** | Fast ephemeral data: who is online right now, heartbeats, manual status with TTL |
| **PostgreSQL** | Durable backup of manual status (`Profile.status`, `Profile.statusExpiresAt`) so status survives Redis restarts |

---

## Status types

| Status | Meaning | How it's set |
|--------|---------|--------------|
| **online** | User is actively connected | Automatic (WebSocket connected) or manual |
| **away** | User was recently active but disconnected | Automatic (within 5 min of last activity) |
| **offline** | User hasn't been active recently | Automatic |
| **dnd** | Do Not Disturb | Manual only |
| **auto** | Clear manual override | User selects "Automatic" in profile |

### Priority (how status is resolved)

1. **Manual override** in Redis/DB (if not expired) → use that status
2. **WebSocket connected** → `online`
3. **Last seen within 5 minutes** → `away`
4. Otherwise → `offline`

---

## Redis keys

All keys live under the `presence:` namespace:

```
presence:online:{userId}      → "1" with 90s TTL (refreshed on heartbeat)
presence:lastseen:{userId}    → timestamp ms, 15 min TTL
presence:manual:{userId}      → JSON { status, expiresAt }, TTL = duration
presence:updates              → pub/sub channel for broadcasting changes
```

### Why TTL?

Redis keys expire automatically. If a user's browser crashes without sending "disconnect", the `online` key expires after 90 seconds and they appear offline/away without manual cleanup.

---

## WebSocket protocol

Connect to `ws://localhost:3001` (or `NEXT_PUBLIC_PRESENCE_WS_URL`).

### Client → Server

```json
{ "type": "auth", "token": "<supabase-access-token>" }
{ "type": "ping" }
{ "type": "subscribe", "userIds": ["user-id-1", "user-id-2"] }
{ "type": "unsubscribe", "userIds": ["user-id-1"] }
{ "type": "set_status", "status": "dnd", "durationMinutes": 60 }
```

### Server → Client

```json
{ "type": "auth_ok", "userId": "..." }
{ "type": "status_update", "userId": "...", "status": "online", "isManual": false, "expiresAt": null }
{ "type": "status_batch", "statuses": { "user-id-1": { "status": "online", ... } } }
{ "type": "pong" }
```

### Flow when you open the app

1. Browser gets Supabase session token
2. Opens WebSocket, sends `{ type: "auth", token }`
3. Server verifies token → marks user online in Redis
4. Server sends `{ type: "auth_ok" }` + current status
5. Client subscribes to user IDs it needs (desk members, etc.)
6. Every 30s client sends `{ type: "ping" }` to refresh online TTL

---

## File map

```
server/
  presence-server.ts          ← WebSocket server entry point
  lib/auth.ts                 ← Verifies Supabase JWT

src/features/presence/
  domain/types.ts             ← Shared types and constants
  infrastructure/
    redis.ts                  ← Redis client singleton
    PresenceService.ts        ← Core business logic (Redis + Prisma)
    status-utils.ts           ← Enum mapping helpers
  presentation/
    providers/PresenceProvider.tsx   ← React context + WS client
    hooks/useActivityStatus.ts       ← Subscribe to a user's status
    components/
      ActivityStatusPicker.tsx       ← Profile tab UI
      ProfileAvatarWithStatus.tsx    ← Avatar with live status badge

src/actions/presence/
  setActivityStatusAction.ts  ← Server action for manual status
  getActivityStatusesAction.ts
```

---

## React usage

### Show status on an avatar

```tsx
import { ProfileAvatarWithStatus } from "@/features/presence/presentation/components";

<ProfileAvatarWithStatus profile={member.profile} size="xl" />
```

### Get status for one user

```tsx
import { useActivityStatus } from "@/features/presence/presentation/hooks";

const { status, isManual, expiresAt } = useActivityStatus(userId);
// status: "online" | "away" | "offline" | "dnd"
```

### Change your own status (profile tab)

The `ActivityStatusPicker` component in the Profile tab calls `setStatus()` from `usePresence()`.

---

## Setup (local development)

### 1. Install Redis

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis
```

**Docker:**
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### 2. Environment variables

Add to `.env`:

```env
REDIS_URL=redis://127.0.0.1:6379
PRESENCE_WS_PORT=3001
NEXT_PUBLIC_PRESENCE_WS_URL=ws://localhost:3001
```

### 3. Run database migration

```bash
npm run prisma:migrate
```

This adds `lastActiveAt`, `status`, and `statusExpiresAt` to the `Profile` table.

### 4. Start both servers

```bash
# Terminal 1 — Next.js
npm run dev

# Terminal 2 — Presence WebSocket server
npm run dev:presence

# Or both at once:
npm run dev:all
```

### 5. Verify it works

1. Open the app in two browser windows (or one normal + one incognito)
2. Log in as different users
3. Open a desk's Members view — you should see green dots for connected users
4. In Profile tab, set status to "Do Not Disturb" for 30 minutes — other window updates immediately

---

## How manual status expiry works

When you set "DND for 1 hour":

1. Redis stores `presence:manual:{userId}` with `EX 3600` (1 hour TTL)
2. Prisma stores `status = DND`, `statusExpiresAt = now + 1 hour`
3. After 1 hour, Redis key expires automatically
4. On next status read, `PresenceService` sees expired manual status, clears it, and resolves automatically

"Until I change it" stores the key **without TTL** in Redis and `statusExpiresAt = null` in Prisma.

---

## Production considerations

This implementation runs the WebSocket server as a **separate Node process**. For production you would typically:

- Deploy the presence server alongside Next.js (Railway, Fly.io, etc.)
- Use a managed Redis (Upstash, Redis Cloud, ElastiCache)
- Set `NEXT_PUBLIC_PRESENCE_WS_URL=wss://presence.yourdomain.com`
- Consider sticky sessions if you scale to multiple presence server instances (Redis pub/sub already handles cross-instance broadcast)

On **Vercel**, Next.js API routes cannot hold long-lived WebSocket connections — the separate server is required.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| All users show offline | Presence server not running, or Redis not reachable |
| Status doesn't update live | Check browser console for WebSocket errors; verify `NEXT_PUBLIC_PRESENCE_WS_URL` |
| Manual status not persisting | Run Prisma migration; check Redis connection |
| Green dot on profile but gray elsewhere | Component not using `ProfileAvatarWithStatus` or `useActivityStatus` |

Check presence server logs:
```
[presence] WebSocket server listening on ws://localhost:3001
```

Check Redis:
```bash
redis-cli keys "presence:*"
redis-cli get "presence:online:YOUR_USER_ID"
```

---

## Learning resources

- [WebSockets MDN guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Redis pub/sub](https://redis.io/docs/interact/pubsub/)
- [ioredis documentation](https://github.com/redis/ioredis)
- [ws library (Node WebSocket)](https://github.com/websockets/ws)
