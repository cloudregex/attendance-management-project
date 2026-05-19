import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize from './config/db.js';
import Department from './model/department.model.js';
import Teacher from './model/teacher.model.js';
import Student from './model/student.model.js';

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // We skip alter: true here to avoid the 64 keys limit issue you encountered before
        await sequelize.sync(); 

        // Ensure at least one department exists
        let [dept] = await Department.findOrCreate({
            where: { name: 'Computer Science' },
            defaults: { code: 'CS' }
        });
        
        console.log(`✅ Using Department: ${dept.name} (ID: ${dept.id})`);

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Seed Teacher
        const [teacher, teacherCreated] = await Teacher.findOrCreate({
            where: { email: 'teacher@example.com' },
            defaults: {
                first_name: 'John',
                last_name: 'Doe',
                employee_id: 'EMP1001',
                department_id: dept.id,
                password: hashedPassword,
                designation: 'Assistant Professor',
                subjects: ['Data Structures', 'Algorithms'],
                classes: ['Second Year', 'Third Year']
            }
        });

        if (teacherCreated) {
            console.log(`✅ Teacher created: ${teacher.first_name} ${teacher.last_name} (${teacher.email})`);
        } else {
            console.log(`ℹ️  Teacher already exists: ${teacher.email}`);
        }

        // 2. Seed Student
        const [student, studentCreated] = await Student.findOrCreate({
            where: { email: 'student@example.com' },
            defaults: {
                first_name: 'Alice',
                last_name: 'Smith',
                roll_number: 'CS2026001',
                department_id: dept.id,
                password: hashedPassword,
                course: 'B.Tech',
                class_name: 'Second Year',
                semester: '3',
                admission_year: '2025'
            }
        });

        if (studentCreated) {
            console.log(`✅ Student created: ${student.first_name} ${student.last_name} (${student.email})`);
        } else {
            console.log(`ℹ️  Student already exists: ${student.email}`);
        }

        console.log('\n🎉 Seed process finished successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
}

seed();
