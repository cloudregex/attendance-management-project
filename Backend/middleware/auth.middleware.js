import jwt from 'jsonwebtoken';
import Admin from '../model/admin.model.js';
import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';
import redisClient from '../config/redis.js';

const permissionAliases = {
    canGrant: ['grant permissions', 'permission assign', 'role assign permissions'],
    canApprove: ['approve requests', 'attendance approve'],
    canManageUsers: ['user list', 'user create', 'user edit', 'user delete', 'user soft delete', 'user hard delete', 'user restore', 'user trash', 'user status', 'user management'],
    canManageRoles: ['role management', 'role list', 'role create', 'role edit', 'role soft delete', 'role hard delete', 'role restore', 'role assign permissions', 'permission list', 'permission create', 'permission edit', 'permission assign'],
    canTakeAttendance: ['take attendance', 'attendance index', 'attendance create'],
    canViewReports: ['attendance reports', 'financial reports', 'view reports', 'report attendance', 'report student', 'report teacher', 'report financial'],
    canModifyRecords: ['modify attendance records', 'attendance edit', 'attendance soft delete', 'attendance restore'],
    canExportData: ['export attendance data', 'database backup', 'user export', 'student export', 'teacher export', 'attendance export', 'report export'],
    canAccessLogs: ['activity logs'],
    canManageDepts: ['department management', 'department list', 'department create', 'department edit', 'department soft delete', 'department hard delete', 'department restore', 'course list', 'course create', 'course edit', 'semester list', 'semester create', 'semester edit', 'subject index', 'subject create', 'subject edit'],
    canViewSchedules: ['class schedules', 'view schedules', 'timetable index'],
    canSystemConfig: ['system settings', 'system configuration']
};

const hasDynamicPermission = (role, requiredPermission) => {
    const aliases = permissionAliases[requiredPermission] || [];
    return role.permissions?.some((permission) => aliases.includes(permission.name?.toLowerCase()));
};

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
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }]
                }]
            });

            if (!admin || !admin.role) {
                return res.status(403).json({ message: "Forbidden: No role assigned" });
            }

            // 'admin' role ID represents the root Administrator, possessing all permissions implicitly
            if (
                admin.role.id === 'admin' ||
                admin.role[requiredPermission] === true ||
                hasDynamicPermission(admin.role, requiredPermission)
            ) {
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

export const checkAnyPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Unauthorized: Invalid user context" });
            }

            const admin = await Admin.findByPk(req.user.id, {
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }]
                }]
            });

            if (!admin || !admin.role) {
                return res.status(403).json({ message: "Forbidden: No role assigned" });
            }

            const allowed = admin.role.id === 'admin' || requiredPermissions.some((permission) =>
                admin.role[permission] === true || hasDynamicPermission(admin.role, permission)
            );

            if (allowed) {
                next();
            } else {
                return res.status(403).json({
                    message: `Forbidden: Requires one of these permissions: ${requiredPermissions.join(', ')}.`
                });
            }
        } catch (error) {
            console.error("âŒ Permission check failed:", error.message);
            res.status(500).json({ message: "Internal server error during permission check" });
        }
    };
};
