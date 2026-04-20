import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';

// General middleware for any authenticated user
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(' ')[1];

        // 1. Check Redis Blacklist
        const isBlacklisted = await redisClient.get(`bl_${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been revoked. Please login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach general user payload
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

export const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(' ')[1];

        // 1. Check Redis Blacklist
        const isBlacklisted = await redisClient.get(`bl_${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been revoked. Please login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Not an admin." });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};