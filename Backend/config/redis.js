// Mock client for local development without Redis
const mockRedisClient = {
    connect: async () => console.log('✅ Mock Redis connected successfully'),
    get: async () => null,
    set: async () => null,
    setEx: async () => null,
    del: async () => null,
    on: () => {},
};

export default mockRedisClient;
