"use server";

import { redis } from "../lib/redis";
import { nanoid } from "nanoid";

export async function createShortUrl(longUrl: string) {
  const id = nanoid(8);
  const key = `url:${id}`;

  await redis.set(key, longUrl, { ex: 86400 }); // 86400 seconds = 24 hours

  console.log(`Server: Stored ${longUrl} with key ${key}`);

  return { key, id };
}
