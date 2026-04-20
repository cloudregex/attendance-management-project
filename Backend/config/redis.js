import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis connected successfully');
    } catch (error) {
        // console.error('❌ Could not connect to Redis:', error);
        // We catch but don't exit so the server can still run if Redis is missing locally, 
        // though auth will fail.
    }
})();

export default redisClient;
