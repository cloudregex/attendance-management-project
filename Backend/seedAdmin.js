import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize from './config/db.js';
import Admin from './model/admin.model.js';

async function seedAdmin() {
    try {
        await sequelize.authenticate();
        await Admin.sync();

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const [admin, created] = await Admin.findOrCreate({
            where: { email: 'admin@attendancepro.com' },
            defaults: {
                username: 'admin',
                password: hashedPassword,
                full_name: 'Alex Johnson',
                role: 'admin'
            }
        });

        if (created) {
            console.log('✅ Admin account created: admin@attendancepro.com / admin123');
        } else {
            console.log('ℹ️ Admin account already exists.');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Admin seed failed:', error);
        process.exit(1);
    }
}

seedAdmin();
