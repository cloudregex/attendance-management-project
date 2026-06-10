import 'dotenv/config';
import sequelize from './config/db.js';

// Import all models
import './model/admin.model.js';
import Department from './model/department.model.js';
import './model/student.model.js';
import Teacher from './model/teacher.model.js';
import Course from './model/course.model.js';
import Subject from './model/subject.model.js';
import Semester from './model/semester.model.js';
import './model/credit.model.js';
import './model/curriculum.model.js';
import './model/subjectAllocation.model.js';
import Classroom from './model/classroom.model.js';
import LectureSlot from './model/lectureSlot.model.js';
import './model/facultySchedule.model.js';
import Timetable from './model/timetable.model.js';
import './model/roomAllocation.model.js';
import './model/attendance.model.js';
import bcrypt from 'bcryptjs';

const seedSampleTimetable = async () => {
    try {
        console.log("🔄 Starting sample timetable seed...");
        await sequelize.authenticate();

        const timestamp = Date.now();

        // 1. Find or Create Department
        const [department] = await Department.findOrCreate({
            where: { name: `Computer Science ${timestamp}` },
            defaults: {
                code: `CS_${timestamp}`,
                status: true
            }
        });

        // 2. Find or Create Course
        const [course] = await Course.findOrCreate({
            where: { name: `Bachelor of Technology ${timestamp}`, department_id: department.id },
            defaults: {
                code: `BT_${timestamp}`,
                duration_semesters: 8,
                academic_year: '2023-2024',
                status: true
            }
        });

        // 3. Find or Create Semester
        const [semester] = await Semester.findOrCreate({
            where: { semester_number: 1, course_id: course.id },
            defaults: {
                name: `Semester 1 ${timestamp}`,
                academic_year: '2023-2024',
                status: true
            }
        });

        // 4. Find or Create Subject
        const [subject] = await Subject.findOrCreate({
            where: { name: `Data Structures ${timestamp}`, department_id: department.id },
            defaults: {
                code: `DS_${timestamp}`,
                subject_type: 'Core',
                status: true
            }
        });

        // 5. Find or Create Teacher
        const hashedPassword = await bcrypt.hash('password123', 10);
        const [teacher] = await Teacher.findOrCreate({
            where: { email: `john.doe.${timestamp}@example.com` },
            defaults: {
                first_name: 'John',
                last_name: 'Doe',
                mobile: '1234567890',
                password: hashedPassword,
                employee_id: `EMP_${timestamp}`,
                gender: 'Male',
                department_id: department.id,
                designation: 'Assistant Professor',
                status: true
            }
        });

        // 6. Find or Create Classroom
        const [classroom] = await Classroom.findOrCreate({
            where: { name: `Room 101 ${timestamp}`, department_id: department.id },
            defaults: {
                code: `R101_${timestamp}`,
                capacity: 60,
                room_type: 'lecture',
                status: true
            }
        });

        // 7. Find or Create Lecture Slot
        const [lectureSlot] = await LectureSlot.findOrCreate({
            where: { day_of_week: 'Monday', start_time: '09:00:00' },
            defaults: {
                end_time: '10:00:00',
                slot_type: 'Lecture',
                sequence: 1,
                status: true
            }
        });

        // 8. Create Timetable Entry
        const timetable = await Timetable.create({
            course_id: course.id,
            semester_id: semester.id,
            subject_id: subject.id,
            teacher_id: teacher.id,
            department_id: department.id,
            lecture_slot_id: lectureSlot.id,
            classroom_id: classroom.id,
            academic_year: '2023-2024',
            timetable_status: 'published',
            notes: 'Sample Timetable Entry',
            status: true
        });

        console.log("✅ Sample timetable created successfully:");
        console.log(timetable.toJSON());

    } catch (error) {
        console.error("❌ Error seeding timetable:", error);
    } finally {
        process.exit(0);
    }
};

seedSampleTimetable();
