import 'dotenv/config';
import Role from './model/role.model.js';
import Admin from './model/admin.model.js';
import sequelize from './config/db.js';
import { seedAdmin as createAdminInDb } from './controller/admin.controller.js';
import { seedDefaultRoles } from './services/role.service.js';

async function runSeed() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected for seeding");

        // Sync and seed Role model first
        await Role.sync();
        await seedDefaultRoles();

        // Sync model (ensure table exists)
        await Admin.sync();

        const adminData = {
            name: "Super Admin",
            email: "admin@example.com",
            password: "adminpassword123",
            roleId: "admin"
        };

        await createAdminInDb(adminData);
        
        console.log('✅ Admin seeding process finished');
        process.exit(0);
    } catch (error) {
        console.error('❌ Admin seed failed:', error);
        process.exit(1);
    }
}

runSeed();
