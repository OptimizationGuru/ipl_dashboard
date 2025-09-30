import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
  // Redis disabled - always return null
  return null;
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  // Redis disabled - always return null to force fresh data
  return null;
};

export const setCachedData = async <T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> => {
  // Redis disabled - skip caching
  return;
};

export const clearCache = async (pattern: string): Promise<void> => {
  // Redis disabled - skip cache clearing
  return;
};
