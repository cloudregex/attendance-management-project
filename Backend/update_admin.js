import 'dotenv/config';
import Admin from './model/admin.model.js';
import bcrypt from 'bcryptjs';

async function updatePassword() {
    try {
        const hashedPassword = await bcrypt.hash('adminpassword123', 10);
        await Admin.update({ password: hashedPassword }, { where: { email: 'admin@example.com' } });
        console.log('Password for admin@example.com updated to: adminpassword123');
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

updatePassword();
