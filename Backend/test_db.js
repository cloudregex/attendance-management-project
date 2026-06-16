import 'dotenv/config';
import Admin from './model/admin.model.js';
import bcrypt from 'bcryptjs';

async function test() {
    try {
        const adminUser = await Admin.findOne({ where: { email: 'admin@example.com' } });
        if (!adminUser) {
            console.log('Admin not found');
            return;
        }
        console.log('Admin found:', adminUser.email);
        console.log('Stored Password Hash:', adminUser.password);
        
        const isMatch = await bcrypt.compare('adminpassword123', adminUser.password);
        console.log('Does adminpassword123 match?', isMatch);

        const isMatch2 = await bcrypt.compare('adminpassword', adminUser.password);
        console.log('Does adminpassword match?', isMatch2);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
test();
