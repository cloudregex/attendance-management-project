import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../model/admin.model.js';
import Role from '../model/role.model.js';
import {
    getUsersService,
    createUserService,
    updateUserService,
    deleteUserService
} from '../services/admin.service.js';
import { logActivity } from '../services/activity.service.js';

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({
            where: { email },
            include: [{ model: Role, as: 'role' }]
        });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, roleId: admin.roleId },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                email: admin.email,
                roleId: admin.roleId,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("❌ Error logging in admin:", error);
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
