import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../model/admin.model.js';

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '5d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            admin: { email: admin.email }
        });
    } catch (error) {
        console.error("❌ Error logging in admin:", error);
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
