import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize from './config/db.js';

import Department from './model/department.model.js';
import Teacher from './model/teacher.model.js';
import Course from './model/course.model.js';
import Subject from './model/subject.model.js';
import Semester from './model/semester.model.js';
import Credit from './model/credit.model.js';
import Curriculum from './model/curriculum.model.js';
import SubjectAllocation from './model/subjectAllocation.model.js';

const ACADEMIC_YEAR = '2026-2027';

const samples = [
    {
        department: { name: 'Computer Science', code: 'CS' },
        teacher: { first_name: 'Aarav Sharma', email: 'aarav.cs@example.com', employee_id: 'FAC-CS-001' },
        course: { name: 'B.Tech Computer Science', code: 'BTECH-CS', duration_semesters: 8 },
        semester: { semester_number: 1, name: 'Semester 1' },
        subject: { name: 'Programming Fundamentals', code: 'CS101', subject_type: 'core' },
        credit: { lecture: 3, tutorial: 1, practical: 2 },
        weekly_periods: 6,
    },
    {
        department: { name: 'Electronics', code: 'EC' },
        teacher: { first_name: 'Nisha Patel', email: 'nisha.ec@example.com', employee_id: 'FAC-EC-001' },
        course: { name: 'B.Tech Electronics', code: 'BTECH-EC', duration_semesters: 8 },
        semester: { semester_number: 1, name: 'Semester 1' },
        subject: { name: 'Basic Electronics', code: 'EC101', subject_type: 'core' },
        credit: { lecture: 3, tutorial: 0, practical: 2 },
        weekly_periods: 5,
    },
    {
        department: { name: 'Mechanical', code: 'ME' },
        teacher: { first_name: 'Rohan Mehta', email: 'rohan.me@example.com', employee_id: 'FAC-ME-001' },
        course: { name: 'B.Tech Mechanical', code: 'BTECH-ME', duration_semesters: 8 },
        semester: { semester_number: 1, name: 'Semester 1' },
        subject: { name: 'Engineering Mechanics', code: 'ME101', subject_type: 'core' },
        credit: { lecture: 4, tutorial: 1, practical: 0 },
        weekly_periods: 5,
    },
    {
        department: { name: 'Civil', code: 'CE' },
        teacher: { first_name: 'Priya Nair', email: 'priya.ce@example.com', employee_id: 'FAC-CE-001' },
        course: { name: 'B.Tech Civil', code: 'BTECH-CE', duration_semesters: 8 },
        semester: { semester_number: 1, name: 'Semester 1' },
        subject: { name: 'Building Materials', code: 'CE101', subject_type: 'core' },
        credit: { lecture: 3, tutorial: 1, practical: 1 },
        weekly_periods: 5,
    },
    {
        department: { name: 'Management', code: 'MBA' },
        teacher: { first_name: 'Kavya Iyer', email: 'kavya.mba@example.com', employee_id: 'FAC-MBA-001' },
        course: { name: 'Master of Business Administration', code: 'MBA-GEN', duration_semesters: 4 },
        semester: { semester_number: 1, name: 'Semester 1' },
        subject: { name: 'Principles of Management', code: 'MBA101', subject_type: 'core' },
        credit: { lecture: 3, tutorial: 1, practical: 0 },
        weekly_periods: 4,
    },
];

const totalCredits = ({ lecture = 0, tutorial = 0, practical = 0 }) =>
    Number(lecture) + Number(tutorial) + Number(practical);

async function seedAcademicSamples() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const password = await bcrypt.hash('Sample@12345', 10);

        for (const sample of samples) {
            const [department] = await Department.findOrCreate({
                where: { code: sample.department.code },
                defaults: { ...sample.department, status: true },
            });

            await department.update({
                name: sample.department.name,
                status: true,
            });

            const [teacher] = await Teacher.findOrCreate({
                where: { employee_id: sample.teacher.employee_id },
                defaults: {
                    ...sample.teacher,
                    password,
                    department_id: department.id,
                    designation: 'Assistant Professor',
                    qualification: 'M.Tech',
                    subjects: [sample.subject.code],
                    classes: [sample.course.code],
                    joining_date: '2026-06-01',
                    status: true,
                },
            });

            await teacher.update({
                department_id: department.id,
                subjects: [sample.subject.code],
                classes: [sample.course.code],
                status: true,
            });

            const [course] = await Course.findOrCreate({
                where: { code: sample.course.code },
                defaults: {
                    ...sample.course,
                    department_id: department.id,
                    academic_year: ACADEMIC_YEAR,
                    status: true,
                },
            });

            await course.update({
                department_id: department.id,
                academic_year: ACADEMIC_YEAR,
                duration_semesters: sample.course.duration_semesters,
                status: true,
            });

            const [semester] = await Semester.findOrCreate({
                where: {
                    course_id: course.id,
                    semester_number: sample.semester.semester_number,
                    academic_year: ACADEMIC_YEAR,
                },
                defaults: {
                    ...sample.semester,
                    course_id: course.id,
                    academic_year: ACADEMIC_YEAR,
                    status: true,
                },
            });

            await semester.update({
                name: sample.semester.name,
                status: true,
            });

            const [subject] = await Subject.findOrCreate({
                where: { code: sample.subject.code },
                defaults: {
                    ...sample.subject,
                    department_id: department.id,
                    prerequisites: [],
                    syllabus_status: 'uploaded',
                    status: true,
                },
            });

            await subject.update({
                department_id: department.id,
                subject_type: sample.subject.subject_type,
                syllabus_status: 'uploaded',
                status: true,
            });

            const [credit] = await Credit.findOrCreate({
                where: { subject_id: subject.id },
                defaults: { subject_id: subject.id },
            });

            await credit.update({
                ...sample.credit,
                total: totalCredits(sample.credit),
            });

            const [curriculum] = await Curriculum.findOrCreate({
                where: {
                    course_id: course.id,
                    semester_id: semester.id,
                    subject_id: subject.id,
                    academic_year: ACADEMIC_YEAR,
                },
                defaults: {
                    course_id: course.id,
                    semester_id: semester.id,
                    subject_id: subject.id,
                    academic_year: ACADEMIC_YEAR,
                    plan_version: 'sample-v1',
                    is_mandatory: true,
                    notes: 'Sample integrated curriculum mapping',
                    status: true,
                },
            });

            await curriculum.update({
                plan_version: 'sample-v1',
                is_mandatory: true,
                status: true,
            });

            const [allocation] = await SubjectAllocation.findOrCreate({
                where: {
                    subject_id: subject.id,
                    course_id: course.id,
                    semester_id: semester.id,
                    department_id: department.id,
                    academic_year: ACADEMIC_YEAR,
                },
                defaults: {
                    subject_id: subject.id,
                    course_id: course.id,
                    semester_id: semester.id,
                    department_id: department.id,
                    teacher_id: teacher.id,
                    academic_year: ACADEMIC_YEAR,
                    weekly_periods: sample.weekly_periods,
                    status: true,
                },
            });

            await allocation.update({
                teacher_id: teacher.id,
                weekly_periods: sample.weekly_periods,
                status: true,
            });

            console.log(`Seeded: ${department.code} -> ${course.code} -> ${semester.name} -> ${subject.code} -> ${teacher.employee_id}`);
        }

        console.log('\nAcademic sample data seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Academic sample seed failed:', error);
        process.exit(1);
    }
}

seedAcademicSamples();
