import jwt from 'jsonwebtoken';
import Admin from '../model/admin.model.js';
import Role from '../model/role.model.js';
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
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

export const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            // Check Redis Blacklist
            const isBlacklisted = await redisClient.get(`bl_${token}`);
            if (isBlacklisted) {
                return res.status(401).json({ message: "Token has been revoked. Please login again." });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Contains id, email, role
            next();
        } catch (error) {
            console.error("❌ Token verification failed:", error.message);
            res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized: No token provided" });
    }
};

export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Verify if user info exists from the prior checkAuth middleware
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Unauthorized: Invalid user context" });
            }

            const admin = await Admin.findByPk(req.user.id, {
                include: [{ model: Role, as: 'role' }]
            });

            if (!admin || !admin.role) {
                return res.status(403).json({ message: "Forbidden: No role assigned" });
            }

            // 'admin' role ID represents the root Administrator, possessing all permissions implicitly
            if (admin.role.id === 'admin' || admin.role[requiredPermission] === true) {
                next();
            } else {
                return res.status(403).json({ message: `Forbidden: Requires '${requiredPermission}' permission.` });
            }

        } catch (error) {
            console.error("❌ Permission check failed:", error.message);
            res.status(500).json({ message: "Internal server error during permission check" });
        }
    };
};