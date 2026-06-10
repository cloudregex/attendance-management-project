import 'dotenv/config';
import sequelize from './config/db.js';
import Department from './model/department.model.js';

const DEPARTMENTS = [
    { name: 'Computer Science',  code: 'CS'  },
    { name: 'Electronics',       code: 'EC'  },
    { name: 'Mechanical',        code: 'ME'  },
    { name: 'Civil',             code: 'CE'  },
    { name: 'Applied Sciences',  code: 'AS'  },
    { name: 'Management',        code: 'MBA' },
];

async function seed() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        for (const dept of DEPARTMENTS) {
            const [record, created] = await Department.findOrCreate({
                where: { name: dept.name },
                defaults: dept,
            });
            console.log(`${created ? '✅ Created' : 'ℹ️  Exists '}: ${record.name}`);
        }

        console.log('\n🎉 Departments seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
