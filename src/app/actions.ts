"use server";

import { redis } from "../lib/redis";

export async function createTestKey() {
  const timestamp = Date.now();
  const key = `test:${timestamp}`;

  await redis.set(key, "This is a test value", { ex: 100 });

  return { key };
}
