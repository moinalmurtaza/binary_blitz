import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const redisConnection = {
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null, // Critical requirement for BullMQ
};

// Create a general purpose Redis client for caching or socket adapters
const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully.');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redisClient;
