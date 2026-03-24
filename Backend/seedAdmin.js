import 'dotenv/config';
import Role from './model/role.model.js';
import Admin from './model/admin.model.js';
import sequelize from './config/db.js';
import { seedAdmin } from './controller/admin.controller.js';
import { seedDefaultRoles } from './services/role.service.js';

const runSeed = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected for seeding");

        // Sync and seed Role model first
        await Role.sync({ alter: true });
        await seedDefaultRoles();

        // Sync model (ensure table exists)
        await Admin.sync({ alter: true });

        const adminData = {
            name: "Super Admin",
            email: "admin@example.com",
            password: "adminpassword123",
            roleId: "admin"
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
