import { ActivityStatus } from "@/lib/db/prisma";
import type { ActivityStatusValue, ResolvedActivityStatus } from "../domain/types";

export function toActivityStatusValue(status: ActivityStatus): ActivityStatusValue {
  switch (status) {
    case ActivityStatus.ONLINE:
      return "online";
    case ActivityStatus.OFFLINE:
      return "offline";
    case ActivityStatus.AWAY:
      return "away";
    case ActivityStatus.DND:
      return "dnd";
  }
}

export function toActivityStatusEnum(status: ActivityStatusValue): ActivityStatus {
  switch (status) {
    case "online":
      return ActivityStatus.ONLINE;
    case "offline":
      return ActivityStatus.OFFLINE;
    case "away":
      return ActivityStatus.AWAY;
    case "dnd":
      return ActivityStatus.DND;
  }
}

export function isManualStatusExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false;
  return Date.parse(expiresAt) <= Date.now();
}

export type ManualStatusPayload = {
  status: ActivityStatusValue;
  expiresAt: string | null;
};

export function parseManualStatus(raw: string | null): ManualStatusPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ManualStatusPayload;
    if (!parsed?.status) return null;
    if (isManualStatusExpired(parsed.expiresAt)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function resolvedStatus(
  status: ActivityStatusValue,
  isManual: boolean,
  expiresAt: string | null = null,
): ResolvedActivityStatus {
  return { status, isManual, expiresAt };
}
