import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../model/admin.model.js';
import NotificationToken from '../model/notificationToken.model.js';
import firebaseAdmin from '../config/firebase.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken
} from '../utils/token.service.js';
import redisClient from '../config/redis.js';
import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';
import {
    getUsersService,
    createUserService,
    updateUserService,
    deleteUserService
} from '../services/admin.service.js';
import { logActivity } from '../services/activity.service.js';

// Isolated, non-blocking notification service for the Admin module
const sendAdminNotificationService = async (title, body) => {
    try {
        const tokensResult = await NotificationToken.findAll();
        const tokens = tokensResult.map(t => t.token);

        if (tokens.length === 0) {
            console.log("ℹ️ No admin notification tokens found in database.");
            return;
        }

        const payload = {
            notification: { title, body },
            tokens
        };

        const response = await firebaseAdmin.messaging().sendEachForMulticast(payload);
        console.log(`✅ Admin Multi-Notification: Success(${response.successCount}), Failure(${response.failureCount})`);
    } catch (error) {
        console.error("❌ Isolated Admin Notification Error:", error.message);
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminUser = await Admin.findOne({
            where: { email },
            include: [{
                model: Role,
                as: 'role',
                include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }]
            }]
        });

        if (!adminUser) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate Tokens
        // (If generateAccessToken requires role info, ensure it reads from adminUser.role)
        const accessToken = generateAccessToken(adminUser);
        const refreshToken = generateRefreshToken(adminUser);
        const token = jwt.sign(
            { id: adminUser.id, email: adminUser.email, roleId: adminUser.roleId },
            process.env.JWT_SECRET,
            { expiresIn: '5d' }
        );

        // Store hashed refresh token in DB
        adminUser.refreshToken = hashToken(refreshToken);
        await adminUser.save();

        // Security Alert
        sendAdminNotificationService(
            'Admin Security Alert',
            `Login detected for account: ${adminUser.email}`
        );

        // Set Refresh Token in Secure HTTP-only cookie
        res.cookie('adminRefreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            accessToken: accessToken || token, // Ensure backwards compatibility
            token: token || accessToken,
            admin: {
                email: adminUser.email,
                roleId: adminUser.roleId,
                role: adminUser.role
            }
        });
    } catch (error) {
        console.error("❌ Error logging in admin:", error);
        res.status(500).json({ error: error.message });
    }
};

export const refreshAdminToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.adminRefreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token missing" });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const adminUser = await Admin.findByPk(decoded.id);
        if (!adminUser || adminUser.refreshToken !== hashToken(refreshToken)) {
            return res.status(403).json({ message: "Refresh token mismatch or user deleted" });
        }

        // Token Rotation: Generate new set
        const newAccessToken = generateAccessToken(adminUser);
        const newRefreshToken = generateRefreshToken(adminUser);

        // Update DB
        adminUser.refreshToken = hashToken(newRefreshToken);
        await adminUser.save();

        // Set New Cookie
        res.cookie('adminRefreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("❌ Error refreshing admin token:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await getUsersService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const logoutAdmin = async (req, res) => {
    try {
        console.log("🔓 Logout requested...");
        const refreshToken = req.cookies.adminRefreshToken;
        const authHeader = req.headers.authorization;

        // 1. Clear refresh token from DB
        if (refreshToken) {
            console.log("  - Clearing refresh token from DB");
            const decoded = verifyRefreshToken(refreshToken);
            if (decoded) {
                const adminUser = await Admin.findByPk(decoded.id);
                if (adminUser) {
                    adminUser.refreshToken = null;
                    await adminUser.save();
                }
            }
        }

        // 2. Blacklist current access token in Redis
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            console.log("  - Blacklisting access token in Redis");
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const expiry = decoded.exp - Math.floor(Date.now() / 1000);
                if (expiry > 0) {
                    await redisClient.setEx(`bl_${token}`, expiry, 'true');
                    console.log(`  - ✅ Token blacklisted in Redis for ${expiry} seconds`);
                }
            } catch (err) {
                console.log("  - ⚠️ Blacklisting failed or token expired:", err.message);
            }
        } else {
            console.log("  - ⚠️ No Bearer token found in headers for blacklisting");
        }

        // 3. Clear cookie
        res.clearCookie('adminRefreshToken');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("❌ Logout Error:", error);
        res.status(500).json({ error: "Logout failed" });
    }
};

export const createUser = async (req, res) => {
    try {
        const user = await createUserService(req.body);

        // Log Activity
        await logActivity(req.user?.id, 'CREATE_USER', 'User', user.id, { email: user.email, name: user.name });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await updateUserService(req.params.id, req.body);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Log Activity
        await logActivity(req.user?.id, 'UPDATE_USER', 'User', user.id, { name: user.name });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const result = await deleteUserService(req.params.id);
        if (!result) return res.status(404).json({ message: "User not found" });

        // Log Activity
        await logActivity(req.user?.id, 'DELETE_USER', 'User', req.params.id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Seeding function (not exposed via route)
export const seedAdmin = async (adminData) => {
    try {
        const existingAdmin = await Admin.findOne({ where: { email: adminData.email } });
        if (existingAdmin) {
            console.log("ℹ️ Admin already exists:", adminData.email);
            return existingAdmin;
        }

        // Hash password before creating
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        const admin = await Admin.create({ ...adminData, password: hashedPassword });

        console.log("✅ Admin seeded:", admin.email);
        return admin;
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        throw error;
    }
};
