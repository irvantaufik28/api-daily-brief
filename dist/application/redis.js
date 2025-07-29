"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/redisClient.ts
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_TLS_URL, // gunakan rediss:// dari .env
});
redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});
redisClient.on('connect', () => {
    console.log('✅ Redis connected');
});
exports.default = redisClient;
//# sourceMappingURL=redis.js.map