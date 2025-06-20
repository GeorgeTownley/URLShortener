"use server";

import { redis } from "../lib/redis";
import { nanoid } from "nanoid";

const DAILY_LIMIT = 10000;

async function checkDailyLimit(): Promise<{
  allowed: boolean;
  count: number;
  resetsAt: Date;
}> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const countKey = `daily_count:${today}`;

  // Get current count
  const currentCount = (await redis.get(countKey)) || 0;
  const count =
    typeof currentCount === "number"
      ? currentCount
      : parseInt(currentCount as string) || 0;

  // Calculate when the limit resets (midnight UTC)
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  return {
    allowed: count < DAILY_LIMIT,
    count: count,
    resetsAt: tomorrow,
  };
}

async function incrementDailyCount(): Promise<void> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const countKey = `daily_count:${today}`;

  // Increment counter and set expiration for tomorrow midnight
  await redis.incr(countKey);

  // Set expiration to tomorrow midnight (in seconds)
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  const secondsUntilMidnight = Math.floor(
    (tomorrow.getTime() - now.getTime()) / 1000
  );

  await redis.expire(countKey, secondsUntilMidnight);
}

export async function createShortUrl(longUrl: string) {
  // Check daily limit first
  const limitCheck = await checkDailyLimit();

  if (!limitCheck.allowed) {
    throw new Error(
      `Daily limit of ${DAILY_LIMIT} URLs exceeded. Limit resets at ${limitCheck.resetsAt.toISOString()}`
    );
  }

  const id = nanoid(8);
  const key = `url:${id}`;

  await redis.set(key, longUrl, { ex: 86400 }); // 86400 seconds = 24 hours

  // Increment the daily counter
  await incrementDailyCount();

  console.log(`Server: Stored ${longUrl} with key ${key}`);
  console.log(`Daily count: ${limitCheck.count + 1}/${DAILY_LIMIT}`);

  return { key, id };
}
