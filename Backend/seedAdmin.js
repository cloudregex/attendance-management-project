import 'dotenv/config';
import Admin from './model/admin.model.js';
import sequelize from './config/db.js';
import { seedAdmin } from './controller/admin.controller.js';

const runSeed = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected for seeding");

        // Sync model (ensure table exists)
        await Admin.sync();

        const adminData = {
            email: "admin@example.com",
            password: "adminpassword123" 
        };

        // Delete existing admin to ensure it's re-created with hashed password
        await Admin.destroy({ where: { email: adminData.email } });
        console.log("ℹ️ Deleted existing admin for re-seeding");

        await seedAdmin(adminData);
        console.log("🚀 Seeding completed successfully (Password is now hashed)");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

runSeed();
