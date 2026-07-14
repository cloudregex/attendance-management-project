import { createClient } from 'redis';

// Mock client for local development or when Redis is down
const mockRedisClient = {
    connect: async () => {
        console.log('ℹ️ Using Mock Redis Client (Fallback/Development)');
        return Promise.resolve();
    },
    get: async () => null,
    set: async () => null,
    setEx: async () => null,
    del: async () => null,
    on: (event, handler) => {},
    isMock: true
};

let redisClient = mockRedisClient;

const REDIS_URL = process.env.REDIS_URL || (process.env.REDIS_HOST ? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}` : null);

if (REDIS_URL) {
    try {
        const client = createClient({
            url: REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    const delay = Math.min(retries * 100, 3000);
                    console.log(`Redis reconnect attempt #${retries} in ${delay}ms`);
                    return delay;
                }
            }
        });

        client.on('error', (err) => {
            console.error('❌ Redis Client Error:', err.message);
        });

        client.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });

        client.connect().catch((err) => {
            console.error('❌ Redis initial connection failed. Redis client will retry in background.', err.message);
        });

        redisClient = client;
    } catch (err) {
        console.error('❌ Failed to initialize real Redis client, falling back to mock:', err.message);
        redisClient = mockRedisClient;
    }
} else {
    console.log('ℹ️ Redis URL not provided. Defaulting to Mock Redis Client.');
}

export default redisClient;
