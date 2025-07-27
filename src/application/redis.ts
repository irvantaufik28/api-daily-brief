// src/config/redisClient.ts
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_TLS_URL, // gunakan rediss:// dari .env
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

export default redisClient;
