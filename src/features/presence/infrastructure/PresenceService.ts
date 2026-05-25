import { prisma } from "@/lib/db/prisma";
import {
  AWAY_THRESHOLD_MS,
  LAST_SEEN_TTL_SECONDS,
  ONLINE_TTL_SECONDS,
  PRESENCE_REDIS_KEYS,
  type ActivityStatusValue,
  type ManualActivityStatus,
  type ResolvedActivityStatus,
} from "../domain/types";
import { getRedis } from "./redis";
import {
  parseManualStatus,
  resolvedStatus,
  toActivityStatusEnum,
  toActivityStatusValue,
} from "./status-utils";

type ManualStatusPayload = {
  status: ActivityStatusValue;
  expiresAt: string | null;
};

export class PresenceService {
  private readonly redis = getRedis();

  async markOnline(userId: string): Promise<void> {
    const now = Date.now().toString();
    await this.redis
      .multi()
      .set(PRESENCE_REDIS_KEYS.online(userId), "1", "EX", ONLINE_TTL_SECONDS)
      .set(PRESENCE_REDIS_KEYS.lastSeen(userId), now, "EX", LAST_SEEN_TTL_SECONDS)
      .exec();

    await prisma.profile.update({
      where: { userId },
      data: { lastActiveAt: new Date() },
    });
  }

  async heartbeat(userId: string): Promise<void> {
    const now = Date.now().toString();
    await this.redis
      .multi()
      .set(PRESENCE_REDIS_KEYS.online(userId), "1", "EX", ONLINE_TTL_SECONDS)
      .set(PRESENCE_REDIS_KEYS.lastSeen(userId), now, "EX", LAST_SEEN_TTL_SECONDS)
      .exec();
  }

  async markOffline(userId: string): Promise<void> {
    const now = Date.now().toString();
    await this.redis
      .multi()
      .del(PRESENCE_REDIS_KEYS.online(userId))
      .set(PRESENCE_REDIS_KEYS.lastSeen(userId), now, "EX", LAST_SEEN_TTL_SECONDS)
      .exec();

    await prisma.profile.update({
      where: { userId },
      data: { lastActiveAt: new Date() },
    });
  }

  async getManualStatus(userId: string): Promise<ManualStatusPayload | null> {
    const raw = await this.redis.get(PRESENCE_REDIS_KEYS.manual(userId));
    const parsed = parseManualStatus(raw);
    if (parsed) return parsed;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { status: true, statusExpiresAt: true },
    });

    if (!profile?.status) return null;

    const expiresAt = profile.statusExpiresAt?.toISOString() ?? null;
    if (expiresAt && Date.parse(expiresAt) <= Date.now()) {
      await this.clearManualStatus(userId);
      return null;
    }

    return {
      status: toActivityStatusValue(profile.status),
      expiresAt,
    };
  }

  async resolveStatus(userId: string): Promise<ResolvedActivityStatus> {
    const manual = await this.getManualStatus(userId);
    if (manual) {
      return resolvedStatus(manual.status, true, manual.expiresAt);
    }

    const [isOnline, lastSeenRaw] = await this.redis.mget(
      PRESENCE_REDIS_KEYS.online(userId),
      PRESENCE_REDIS_KEYS.lastSeen(userId),
    );

    if (isOnline) {
      return resolvedStatus("online", false, null);
    }

    const lastSeenMs = lastSeenRaw ? Number(lastSeenRaw) : null;
    if (lastSeenMs && Date.now() - lastSeenMs <= AWAY_THRESHOLD_MS) {
      return resolvedStatus("away", false, null);
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { lastActiveAt: true },
    });

    if (profile?.lastActiveAt) {
      const elapsed = Date.now() - profile.lastActiveAt.getTime();
      if (elapsed <= AWAY_THRESHOLD_MS) {
        return resolvedStatus("away", false, null);
      }
    }

    return resolvedStatus("offline", false, null);
  }

  async getStatuses(userIds: string[]): Promise<Record<string, ResolvedActivityStatus>> {
    const uniqueIds = [...new Set(userIds.filter(Boolean))];
    const entries = await Promise.all(
      uniqueIds.map(async (userId) => [userId, await this.resolveStatus(userId)] as const),
    );
    return Object.fromEntries(entries);
  }

  async setManualStatus(
    userId: string,
    status: ManualActivityStatus,
    durationMinutes?: number | null,
  ): Promise<ResolvedActivityStatus> {
    if (status === "auto") {
      await this.clearManualStatus(userId);
      return this.resolveStatus(userId);
    }

    const expiresAt =
      durationMinutes && durationMinutes > 0
        ? new Date(Date.now() + durationMinutes * 60 * 1000)
        : null;

    const payload: ManualStatusPayload = {
      status,
      expiresAt: expiresAt?.toISOString() ?? null,
    };

    const manualKey = PRESENCE_REDIS_KEYS.manual(userId);
    if (durationMinutes && durationMinutes > 0) {
      await this.redis.set(manualKey, JSON.stringify(payload), "EX", durationMinutes * 60);
    } else {
      await this.redis.set(manualKey, JSON.stringify(payload));
    }

    await prisma.profile.update({
      where: { userId },
      data: {
        status: toActivityStatusEnum(status),
        statusExpiresAt: expiresAt,
        lastActiveAt: new Date(),
      },
    });

    const resolved = resolvedStatus(status, true, payload.expiresAt);
    await this.publishStatusUpdate(userId, resolved);
    return resolved;
  }

  async clearManualStatus(userId: string): Promise<void> {
    await this.redis.del(PRESENCE_REDIS_KEYS.manual(userId));
    await prisma.profile.update({
      where: { userId },
      data: {
        status: null,
        statusExpiresAt: null,
      },
    });

    const resolved = await this.resolveStatus(userId);
    await this.publishStatusUpdate(userId, resolved);
  }

  async publishStatusUpdate(userId: string, status: ResolvedActivityStatus): Promise<void> {
    await this.redis.publish(
      PRESENCE_REDIS_KEYS.updatesChannel,
      JSON.stringify({ userId, ...status }),
    );
  }
}

let presenceService: PresenceService | undefined;

export function getPresenceService(): PresenceService {
  if (!presenceService) {
    presenceService = new PresenceService();
  }
  return presenceService;
}
