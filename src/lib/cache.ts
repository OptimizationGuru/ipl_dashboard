import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      // Don't throw error, just log it
    });
    
    try {
      await redisClient.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      redisClient = null;
      return null;
    }
  }
  
  return redisClient;
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const client = await getRedisClient();
    if (!client) {
      return null; // Redis not available
    }
    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

export const setCachedData = async <T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> => {
  try {
    const client = await getRedisClient();
    if (!client) {
      return; // Redis not available, skip caching
    }
    await client.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting cached data:', error);
  }
};

export const clearCache = async (pattern: string): Promise<void> => {
  try {
    const client = await getRedisClient();
    if (!client) {
      return; // Redis not available
    }
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
