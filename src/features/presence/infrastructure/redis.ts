import Redis from "ioredis";

declare global {
  var __presenceRedis: Redis | undefined;
  var __presenceRedisSub: Redis | undefined;
}

function createRedisClient() {
  const url = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
  return new Redis(url, {
    maxRetriesPerRequest: 3,
  });
}

/** Primary Redis client for reads/writes. */
export function getRedis(): Redis {
  if (!global.__presenceRedis) {
    global.__presenceRedis = createRedisClient();
  }
  return global.__presenceRedis;
}

/** Dedicated subscriber client (Redis requires a separate connection for pub/sub). */
export function getRedisSubscriber(): Redis {
  if (!global.__presenceRedisSub) {
    global.__presenceRedisSub = createRedisClient();
  }
  return global.__presenceRedisSub;
}

export async function connectRedisClients() {
  // ioredis connects automatically; this ensures both clients are initialized.
  getRedis();
  getRedisSubscriber();
}
