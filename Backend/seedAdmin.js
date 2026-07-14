import 'dotenv/config';
import Role from './model/role.model.js';
import Admin from './model/admin.model.js';
import sequelize from './config/db.js';
import { seedAdmin as createAdminInDb } from './controller/admin.controller.js';
import { seedDefaultRoles } from './services/role.service.js';
import bcrypt from 'bcryptjs';

async function runSeed() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected for seeding");

        const hashedPassword = await bcrypt.hash('system12345', 10);

        // Sync and seed Role model first
        await Role.sync();
        await seedDefaultRoles();

        // Sync model (ensure table exists)
        await Admin.sync();

        const [admin, created] = await Admin.findOrCreate({
            where: { email: 'system@gmail.com' },
            defaults: {
                name: 'Super Admin',
                password: hashedPassword,
                roleId: 'admin'
            }
        });

        if (created) {
            console.log('✅ Admin account created: ');
        } else {
            console.log('ℹ️ Admin account already exists.');
        }

        console.log('✅ Admin seeding process finished');
        process.exit(0);
    } catch (error) {
        console.error('❌ Admin seed failed:', error);
        process.exit(1);
    }
}

runSeed();
