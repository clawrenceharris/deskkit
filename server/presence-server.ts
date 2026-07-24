/**
 * Standalone WebSocket server for real-time activity status.
 *
 * Run: npm run dev:presence
 * Requires Redis (REDIS_URL) and Supabase env vars for auth.
 */
import { WebSocketServer, WebSocket } from "ws";
import { verifySupabaseAccessToken } from "./lib/auth";
import { connectRedisClients, getRedisSubscriber } from "../src/features/presence/infrastructure/redis";
import { getPresenceService } from "../src/features/presence/infrastructure/PresenceService";
import {
  PRESENCE_REDIS_KEYS,
  type PresenceClientMessage,
  type PresenceServerMessage,
  type ResolvedActivityStatus,
} from "../src/features/presence/domain/types";


const PORT = Number(process.env.PRESENCE_WS_PORT ?? 3001);
const HEARTBEAT_INTERVAL_MS = 30_000;

type ClientState = {
  userId: string | null;
  authenticated: boolean;
  subscriptions: Set<string>;
};

const clientStates = new WeakMap<WebSocket, ClientState>();
/** userId -> set of sockets subscribed to that user's status updates */
const userSubscribers = new Map<string, Set<WebSocket>>();

function getState(ws: WebSocket): ClientState {
  let state = clientStates.get(ws);
  if (!state) {
    state = { userId: null, authenticated: false, subscriptions: new Set() };
    clientStates.set(ws, state);
  }
  return state;
}

function send(ws: WebSocket, message: PresenceServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function subscribeToUser(ws: WebSocket, userId: string) {
  const state = getState(ws);
  if (state.subscriptions.has(userId)) return;

  state.subscriptions.add(userId);
  if (!userSubscribers.has(userId)) {
    userSubscribers.set(userId, new Set());
  }
  userSubscribers.get(userId)!.add(ws);
}

function unsubscribeFromUser(ws: WebSocket, userId: string) {
  const state = getState(ws);
  state.subscriptions.delete(userId);
  userSubscribers.get(userId)?.delete(ws);
}

function unsubscribeAll(ws: WebSocket) {
  const state = getState(ws);
  for (const userId of state.subscriptions) {
    userSubscribers.get(userId)?.delete(ws);
  }
  state.subscriptions.clear();
}

function broadcastStatusUpdate(userId: string, status: ResolvedActivityStatus) {
  const subscribers = userSubscribers.get(userId);
  if (!subscribers) return;

  const message: PresenceServerMessage = {
    type: "status_update",
    userId,
    ...status,
  };

  for (const ws of subscribers) {
    send(ws, message);
  }
}

async function handleMessage(ws: WebSocket, raw: string) {
  let message: PresenceClientMessage;
  try {
    message = JSON.parse(raw) as PresenceClientMessage;
  } catch {
    return;
  }

  const state = getState(ws);
  const presence = getPresenceService();

  switch (message.type) {
    case "auth": {
      const userId = await verifySupabaseAccessToken(message.token);
      if (!userId) {
        send(ws, { type: "auth_error", message: "Invalid token" });
        ws.close();
        return;
      }

      state.userId = userId;
      state.authenticated = true;
      await presence.markOnline(userId);
      send(ws, { type: "auth_ok", userId });

      const selfStatus = await presence.resolveStatus(userId);
      send(ws, {
        type: "status_update",
        userId,
        ...selfStatus,
      });
      break;
    }

    case "ping": {
      if (!state.authenticated || !state.userId) return;
      await presence.heartbeat(state.userId);
      send(ws, { type: "pong" });
      break;
    }

    case "subscribe": {
      if (!state.authenticated) return;

      const statuses: Record<string, ResolvedActivityStatus> = {};
      for (const userId of message.userIds) {
        subscribeToUser(ws, userId);
        statuses[userId] = await presence.resolveStatus(userId);
      }

      send(ws, { type: "status_batch", statuses });
      break;
    }

    case "unsubscribe": {
      for (const userId of message.userIds) {
        unsubscribeFromUser(ws, userId);
      }
      break;
    }

    case "set_status": {
      if (!state.authenticated || !state.userId) return;

      const resolved = await presence.setManualStatus(
        state.userId,
        message.status,
        message.durationMinutes,
      );

      send(ws, {
        type: "status_update",
        userId: state.userId,
        ...resolved,
      });
      break;
    }
  }
}

async function main() {
  await connectRedisClients();

  const subscriber = getRedisSubscriber();
  await subscriber.subscribe(PRESENCE_REDIS_KEYS.updatesChannel);

  subscriber.on("message", (_channel: string, payload: string) => {
    try {
      const update = JSON.parse(payload) as { userId: string } & ResolvedActivityStatus;
      broadcastStatusUpdate(update.userId, {
        status: update.status,
        isManual: update.isManual,
        expiresAt: update.expiresAt,
      });
    } catch (error) {
      console.error("[presence] Failed to handle pub/sub message:", error);
    }
  });

  const wss = new WebSocketServer({ port: PORT });
  console.log(`[presence] WebSocket server listening on ws://localhost:${PORT}`);
  

  wss.on("connection", (ws) => {
    getState(ws);

    ws.on("message", (data) => {
      void handleMessage(ws, data.toString());
    });

    ws.on("close", () => {
      const state = getState(ws);
      if (state.userId) {
        void getPresenceService()
          .markOffline(state.userId)
          .then(async () => {
            const resolved = await getPresenceService().resolveStatus(state.userId!);
            broadcastStatusUpdate(state.userId!, resolved);
          })
          .catch(console.error);
      }
      unsubscribeAll(ws);
    });
  });

  setInterval(() => {
    for (const client of wss.clients) {
      const state = getState(client);
      if (state.authenticated && state.userId) {
        void getPresenceService().heartbeat(state.userId);
      }
    }
  }, HEARTBEAT_INTERVAL_MS);
}

main().catch((error) => {
  console.error("[presence] Server failed to start:", error);
  process.exit(1);
});
