import { AlarmClockOff, Ban, CircleDot, Clock, Dot, LucideProps, Minus, Moon, Timer } from "lucide-react";

export type ActivityStatusValue = "online" | "offline" | "away" | "dnd";

export type ManualActivityStatus = ActivityStatusValue | "auto";

export type ResolvedActivityStatus = {
  status: ActivityStatusValue;
  isManual: boolean;
  expiresAt: string | null;
};

export type SetActivityStatusInput = {
  userId: string;
  status: ManualActivityStatus;
  /** Minutes until manual status expires. Omit or null = until changed manually. */
  durationMinutes?: number | null;
};

export type PresenceServerMessage =
  | { type: "auth_ok"; userId: string }
  | { type: "auth_error"; message: string }
  | { type: "pong" }
  | { type: "status_update"; userId: string; status: ActivityStatusValue; isManual: boolean; expiresAt: string | null }
  | { type: "status_batch"; statuses: Record<string, ResolvedActivityStatus> };

export type PresenceClientMessage =
  | { type: "auth"; token: string }
  | { type: "ping" }
  | { type: "subscribe"; userIds: string[] }
  | { type: "unsubscribe"; userIds: string[] }
  | { type: "set_status"; status: ManualActivityStatus; durationMinutes?: number | null };

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatusValue, string> = {
  online: "Online",
  offline: "Offline",
  away: "Away",
  dnd: "Do Not Disturb",
};
export const ACTIVITY_STATUS_INDICATORS: Record<ActivityStatusValue, { Icon: React.ComponentType<LucideProps> | null; backgroundColor: string; iconClassName: string | null;}> = {
  online: {
    Icon: null,
    iconClassName: null,
    backgroundColor: "bg-success",
  },
  offline: {
    Icon: Minus,
    backgroundColor: "bg-gray-400",
    iconClassName: "text-white fill-white stroke-white stroke-[4px]",
  },
  away: {
    Icon: null,
    backgroundColor: "bg-yellow-400",
    iconClassName: null,
  },
  dnd: {
    Icon: Moon,
    backgroundColor: "bg-tertiary",
    iconClassName: "text-white fill-white stroke-white stroke-[4px]",
  },
}
export const STATUS_DURATION_OPTIONS = [
  { label: "30 minutes", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "4 hours", minutes: 240 },
  { label: "Until I change it", minutes: null },
] as const;

/** How long after last activity a disconnected user shows as away. */
export const AWAY_THRESHOLD_MS = 5 * 60 * 1000;

/** TTL for the online Redis key; refreshed on each heartbeat. */
export const ONLINE_TTL_SECONDS = 90;

/** TTL for last-seen; used to compute away vs offline. */
export const LAST_SEEN_TTL_SECONDS = 15 * 60;

export const PRESENCE_REDIS_KEYS = {
  online: (userId: string) => `presence:online:${userId}`,
  lastSeen: (userId: string) => `presence:lastseen:${userId}`,
  manual: (userId: string) => `presence:manual:${userId}`,
  updatesChannel: "presence:updates",
} as const;
