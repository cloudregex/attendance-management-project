import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../model/admin.model.js';
import NotificationToken from '../model/notificationToken.model.js';
import firebaseAdmin from '../config/firebase.js';


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
        const adminUser = await Admin.findOne({ where: { email } });

        if (!adminUser) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: adminUser.id, email: adminUser.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );

        // Non-blocking notification trigger (isolated within admin module)
        sendAdminNotificationService(
            'Admin Security Alert', 
            `Login detected for account: ${adminUser.email}`
        );

        res.status(200).json({
            message: "Login successful",
            token,
            admin: { email: adminUser.email }
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
