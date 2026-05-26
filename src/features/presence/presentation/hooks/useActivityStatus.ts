"use client";

import { useEffect } from "react";
import { usePresence } from "../providers/PresenceProvider";
import type { ActivityStatusValue } from "../../domain/types";

/**
 * Returns the resolved activity status for a single user.
 * Automatically subscribes to real-time updates via the presence WebSocket.
 */
export function useActivityStatus(userId: string | null | undefined) {
  const { getStatus, subscribe, unsubscribe } = usePresence();

  useEffect(() => {
    if (!userId) return;
    subscribe([userId]);
    return () => unsubscribe([userId]);
  }, [subscribe, unsubscribe, userId]);

  if (!userId) {
    return { status: "offline" as ActivityStatusValue, isManual: false, expiresAt: null };
  }
  console.log("getStatus", getStatus(userId));
  return getStatus(userId);
}

/**
 * Returns resolved activity statuses for multiple users at once.
 */
export function useActivityStatuses(userIds: string[]) {
  const { getStatus, subscribe, unsubscribe } = usePresence();
  const stableKey = userIds.filter(Boolean).sort().join(",");

  useEffect(() => {
    const ids = stableKey ? stableKey.split(",") : [];
    if (ids.length === 0) return;
    subscribe(ids);
    return () => unsubscribe(ids);
  }, [stableKey, subscribe, unsubscribe]);

  const statuses: Record<string, ReturnType<typeof getStatus>> = {};
  for (const id of userIds) {
    if (id) statuses[id] = getStatus(id);
  }

  return statuses;
}
