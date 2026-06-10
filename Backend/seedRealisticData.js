import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize from './config/db.js';

// Import Models
import Admin from './model/admin.model.js';
import Role from './model/role.model.js';
import Permission from './model/permission.model.js';
import ActivityLog from './model/activityLog.model.js';
import Department from './model/department.model.js';
import Student from './model/student.model.js';
import Teacher from './model/teacher.model.js';
import Course from './model/course.model.js';
import Subject from './model/subject.model.js';
import Semester from './model/semester.model.js';
import Credit from './model/credit.model.js';
import Curriculum from './model/curriculum.model.js';
import SubjectAllocation from './model/subjectAllocation.model.js';
import Classroom from './model/classroom.model.js';
import LectureSlot from './model/lectureSlot.model.js';
import FacultySchedule from './model/facultySchedule.model.js';
import Timetable from './model/timetable.model.js';
import RoomAllocation from './model/roomAllocation.model.js';
import Attendance from './model/attendance.model.js';

// Define Associations (copied from server.js)
Role.belongsToMany(Permission, { through: 'RolePermissions', as: 'permissions' });
Permission.belongsToMany(Role, { through: 'RolePermissions', as: 'roles' });

Department.hasMany(Course, { foreignKey: 'department_id', as: 'courses' });
Course.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

Department.hasMany(Subject, { foreignKey: 'department_id', as: 'subjects' });
Subject.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

Course.hasMany(Semester, { foreignKey: 'course_id', as: 'semesters' });
Semester.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Subject.hasOne(Credit, { foreignKey: 'subject_id', as: 'credit' });
Credit.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

Course.hasMany(Curriculum, { foreignKey: 'course_id', as: 'curriculum' });
Curriculum.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Semester.hasMany(Curriculum, { foreignKey: 'semester_id', as: 'curriculum' });
Curriculum.belongsTo(Semester, { foreignKey: 'semester_id', as: 'semester' });
Subject.hasMany(Curriculum, { foreignKey: 'subject_id', as: 'curriculum' });
Curriculum.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

SubjectAllocation.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });
SubjectAllocation.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
SubjectAllocation.belongsTo(Semester, { foreignKey: 'semester_id', as: 'semester' });
SubjectAllocation.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
SubjectAllocation.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

Department.hasMany(Classroom, { foreignKey: 'department_id', as: 'classrooms' });
Classroom.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Teacher.hasMany(FacultySchedule, { foreignKey: 'teacher_id', as: 'availability' });
FacultySchedule.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

Timetable.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });
Timetable.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Timetable.belongsTo(Semester, { foreignKey: 'semester_id', as: 'semester' });
Timetable.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Timetable.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });
Timetable.belongsTo(LectureSlot, { foreignKey: 'lecture_slot_id', as: 'slot' });
Timetable.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
RoomAllocation.belongsTo(Timetable, { foreignKey: 'timetable_id', as: 'timetable' });
RoomAllocation.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
RoomAllocation.belongsTo(LectureSlot, { foreignKey: 'lecture_slot_id', as: 'slot' });

Timetable.hasMany(Attendance, { foreignKey: 'timetable_id', as: 'attendance' });
Attendance.belongsTo(Timetable, { foreignKey: 'timetable_id', as: 'timetable' });
Student.hasMany(Attendance, { foreignKey: 'student_id', as: 'attendance' });
Attendance.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Services
import { seedDefaultRoles } from './services/role.service.js';
import { seedDefaultPermissions } from './services/permission.service.js';

const ACADEMIC_YEAR = '2024-2025';

async function seedDatabase() {
    try {
        console.log("🔄 Starting full database cleanup and realistic seeding...");
        await sequelize.authenticate();
        console.log("✅ DB Connected.");

        // Drop and Recreate All Tables
        console.log("⚠️ Dropping and recreating all tables...");
        await sequelize.sync({ force: true });
        console.log("✅ All tables recreated cleanly.");

        // Seed Roles & Permissions
        console.log("🌱 Seeding Roles & Permissions...");
        await seedDefaultRoles();
        await seedDefaultPermissions();

        const defaultPassword = await bcrypt.hash("password123", 10);

        // Seed Admins
        console.log("🌱 Seeding Admins...");
        await Admin.bulkCreate([
            { name: "System Admin", email: "admin@example.com", password: defaultPassword, roleId: "admin", status: true },
            { name: "Academic Head", email: "academic@example.com", password: defaultPassword, roleId: "subadmin", status: true }
        ]);

        // Seed Departments
        console.log("🌱 Seeding Departments...");
        const d_cs = await Department.create({ name: "Computer Science", code: "CS", description: "Dept of CS", head_of_department: "Dr. Alan Turing", status: true });
        const d_ee = await Department.create({ name: "Electrical Engineering", code: "EE", description: "Dept of EE", head_of_department: "Dr. Nikola Tesla", status: true });
        const d_mba = await Department.create({ name: "Business Administration", code: "MBA", description: "Business School", head_of_department: "Dr. Philip Kotler", status: true });

        // Seed Courses
        console.log("🌱 Seeding Courses...");
        const c_btech_cs = await Course.create({ name: "B.Tech Computer Science", code: "BTECH-CS", duration_semesters: 8, academic_year: ACADEMIC_YEAR, department_id: d_cs.id, status: true });
        const c_btech_ee = await Course.create({ name: "B.Tech Electrical", code: "BTECH-EE", duration_semesters: 8, academic_year: ACADEMIC_YEAR, department_id: d_ee.id, status: true });
        const c_mba = await Course.create({ name: "Master of Business Admin", code: "MBA-GEN", duration_semesters: 4, academic_year: ACADEMIC_YEAR, department_id: d_mba.id, status: true });

        // Seed Semesters
        console.log("🌱 Seeding Semesters...");
        const sem1_cs = await Semester.create({ name: "Semester 1", semester_number: 1, course_id: c_btech_cs.id, academic_year: ACADEMIC_YEAR, status: true });
        const sem2_cs = await Semester.create({ name: "Semester 2", semester_number: 2, course_id: c_btech_cs.id, academic_year: ACADEMIC_YEAR, status: true });
        const sem1_ee = await Semester.create({ name: "Semester 1", semester_number: 1, course_id: c_btech_ee.id, academic_year: ACADEMIC_YEAR, status: true });
        const sem1_mba = await Semester.create({ name: "Semester 1", semester_number: 1, course_id: c_mba.id, academic_year: ACADEMIC_YEAR, status: true });

        // Seed Subjects
        console.log("🌱 Seeding Subjects and Credits...");
        const sub_cs1 = await Subject.create({ name: "Data Structures", code: "CS201", subject_type: "core", department_id: d_cs.id, syllabus_status: 'uploaded', status: true });
        await Credit.create({ subject_id: sub_cs1.id, lecture: 3, tutorial: 1, practical: 2, total: 6 });

        const sub_cs2 = await Subject.create({ name: "Operating Systems", code: "CS202", subject_type: "core", department_id: d_cs.id, syllabus_status: 'uploaded', status: true });
        await Credit.create({ subject_id: sub_cs2.id, lecture: 3, tutorial: 0, practical: 2, total: 5 });
        
        const sub_ee1 = await Subject.create({ name: "Circuit Analysis", code: "EE101", subject_type: "core", department_id: d_ee.id, syllabus_status: 'uploaded', status: true });
        await Credit.create({ subject_id: sub_ee1.id, lecture: 4, tutorial: 1, practical: 0, total: 5 });

        const sub_mba1 = await Subject.create({ name: "Corporate Finance", code: "MBA101", subject_type: "core", department_id: d_mba.id, syllabus_status: 'uploaded', status: true });
        await Credit.create({ subject_id: sub_mba1.id, lecture: 4, tutorial: 0, practical: 0, total: 4 });

        // Seed Teachers
        console.log("🌱 Seeding Teachers...");
        const t1 = await Teacher.create({ first_name: "Alice", last_name: "Smith", email: "alice.cs@example.com", mobile: "9876543210", password: defaultPassword, employee_id: "EMP-CS-01", gender: "Female", department_id: d_cs.id, designation: "Assistant Professor", qualification: "Ph.D. in CS", status: true });
        const t2 = await Teacher.create({ first_name: "Bob", last_name: "Johnson", email: "bob.ee@example.com", mobile: "9876543211", password: defaultPassword, employee_id: "EMP-EE-01", gender: "Male", department_id: d_ee.id, designation: "Professor", qualification: "Ph.D. in EE", status: true });
        const t3 = await Teacher.create({ first_name: "Charlie", last_name: "Brown", email: "charlie.mba@example.com", mobile: "9876543212", password: defaultPassword, employee_id: "EMP-MBA-01", gender: "Male", department_id: d_mba.id, designation: "Associate Professor", qualification: "MBA, Ph.D.", status: true });

        // Seed Students
        console.log("🌱 Seeding Students...");
        const st1 = await Student.create({ first_name: "John", last_name: "Doe", email: "john.doe@example.com", mobile: "9123456780", password: defaultPassword, roll_number: "CS24001", enrollment_number: "EN-CS-24001", gender: "Male", dob: "2004-05-15", course_id: c_btech_cs.id, current_semester: 1, department_id: d_cs.id, batch_year: "2024", admission_date: "2024-08-01", blood_group: "O+", status: true });
        const st2 = await Student.create({ first_name: "Jane", last_name: "Roe", email: "jane.roe@example.com", mobile: "9123456781", password: defaultPassword, roll_number: "CS24002", enrollment_number: "EN-CS-24002", gender: "Female", dob: "2005-02-20", course_id: c_btech_cs.id, current_semester: 1, department_id: d_cs.id, batch_year: "2024", admission_date: "2024-08-01", blood_group: "A+", status: true });
        const st3 = await Student.create({ first_name: "Mark", last_name: "Zucker", email: "mark.z@example.com", mobile: "9123456782", password: defaultPassword, roll_number: "EE24001", enrollment_number: "EN-EE-24001", gender: "Male", dob: "2004-11-10", course_id: c_btech_ee.id, current_semester: 1, department_id: d_ee.id, batch_year: "2024", admission_date: "2024-08-01", blood_group: "B+", status: true });
        const st4 = await Student.create({ first_name: "Emma", last_name: "Watson", email: "emma.w@example.com", mobile: "9123456783", password: defaultPassword, roll_number: "MBA24001", enrollment_number: "EN-MBA-24001", gender: "Female", dob: "2001-04-15", course_id: c_mba.id, current_semester: 1, department_id: d_mba.id, batch_year: "2024", admission_date: "2024-08-01", blood_group: "AB+", status: true });

        // Seed Classrooms
        console.log("🌱 Seeding Classrooms...");
        const room1 = await Classroom.create({ code: "L101", name: "Lecture Hall 101", capacity: 60, room_type: "lecture", department_id: d_cs.id, floor: 1, building: "Block A", status: true });
        const lab1 = await Classroom.create({ code: "CSLAB1", name: "CS Lab 1", capacity: 40, room_type: "lab", department_id: d_cs.id, floor: 2, building: "Block A", status: true });

        // Seed Curriculum & Subject Allocations
        console.log("🌱 Seeding Curriculum & Subject Allocations...");
        await Curriculum.create({ course_id: c_btech_cs.id, semester_id: sem1_cs.id, subject_id: sub_cs1.id, academic_year: ACADEMIC_YEAR, plan_version: "v1", is_mandatory: true, status: true });
        const alloc1 = await SubjectAllocation.create({ subject_id: sub_cs1.id, course_id: c_btech_cs.id, semester_id: sem1_cs.id, department_id: d_cs.id, teacher_id: t1.id, academic_year: ACADEMIC_YEAR, weekly_periods: 5, status: true });

        // Seed Lecture Slots
        console.log("🌱 Seeding Lecture Slots...");
        const slot1 = await LectureSlot.create({ day_of_week: "Monday", start_time: "09:00:00", end_time: "10:00:00", slot_type: "Lecture", sequence: 1, is_break: false, status: true });
        const slot2 = await LectureSlot.create({ day_of_week: "Monday", start_time: "10:00:00", end_time: "11:00:00", slot_type: "Lecture", sequence: 2, is_break: false, status: true });

        // Seed Timetable & Room Allocation
        console.log("🌱 Seeding Timetable & Room Allocation...");
        const tt1 = await Timetable.create({ course_id: c_btech_cs.id, semester_id: sem1_cs.id, subject_id: sub_cs1.id, teacher_id: t1.id, department_id: d_cs.id, lecture_slot_id: slot1.id, classroom_id: room1.id, academic_year: ACADEMIC_YEAR, timetable_status: "published", status: true });
        await RoomAllocation.create({ timetable_id: tt1.id, classroom_id: room1.id, lecture_slot_id: slot1.id, allocation_date: new Date(), status: "active" });

        // Seed Attendance
        console.log("🌱 Seeding Attendance...");
        await Attendance.create({ student_id: st1.id, timetable_id: tt1.id, date: new Date(), status: "present", marked_by: t1.id, verification_method: "manual" });
        await Attendance.create({ student_id: st2.id, timetable_id: tt1.id, date: new Date(), status: "absent", marked_by: t1.id, verification_method: "manual" });

        console.log("✅ All realistic data seeded successfully.");
        console.log("------------------------------------------");
        console.log("Sample Login Credentials:");
        console.log("Admin: admin@example.com / password123");
        console.log("Teacher: alice.cs@example.com / password123");
        console.log("Student: john.doe@example.com / password123");
        console.log("------------------------------------------");
        
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDatabase();
