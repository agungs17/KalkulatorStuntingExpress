import { Redis } from "@upstash/redis";
import config from "../configurations";

const redis = new Redis({
  url: config.upstashRedis.url,
  token: config.upstashRedis.token,
});

export const deleteCache = async (key) => {
  if (!config.upstashRedis.useUpstashRedis) return false;
  try {
    await redis.del(key);
    if (config.logging) console.log(`success delete cache ${key}`);
    return true;
  } catch (err) {
    if (config.logging) console.log(`failed delete cache ${key} ${err.message}`);
    return false;
  }
};

export const setCache = async (key, result, expiredAtOrSeconds = null) => {
  if (!config.upstashRedis.useUpstashRedis) return false;
  try {
    const value = typeof result === "object" ? JSON.stringify(result) : result;

    let ttlSeconds = null;

    if (expiredAtOrSeconds instanceof Date) {
      const now = new Date();
      const diffMs = expiredAtOrSeconds.getTime() - now.getTime();
      ttlSeconds = Math.max(Math.floor(diffMs / 1000), 0);
    } else if (typeof expiredAtOrSeconds === "number") {
      ttlSeconds = expiredAtOrSeconds;
    }

    if (ttlSeconds && ttlSeconds > 0) {
      await redis.set(key, value, { ex: ttlSeconds });
    } else {
      await redis.set(key, value);
    }

    if (config.logging) console.log(`success cache ${key}`);
    return true;
  } catch (err) {
    if (config.logging) console.log(`failed cache ${key} ${err.message}`);
    return false;
  }
};

export const getCache = async (key) => {
  if (!config.upstashRedis.useUpstashRedis) return null;
  try {
    const result = await redis.get(key);

    if (result === null) {
      if (config.logging) console.log(`cache miss ${key}`);
      return null;
    }

    if (config.logging) console.log(`success get cache ${key}`);
    try {
      return JSON.parse(result);
    } catch (e) {
      return result;
    }
  } catch (err) {
    if (config.logging) console.log(`failed get cache ${key} ${err.message}`);
    return null;
  }
};
