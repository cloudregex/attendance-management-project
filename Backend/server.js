import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';

// ── Import models so Sequelize knows about them before sync ───────────────
import './model/admin.model.js';
import './model/department.model.js';
import './model/student.model.js';
import './model/teacher.model.js';
import './model/course.model.js';
import './model/subject.model.js';
import './model/semester.model.js';
import './model/credit.model.js';
import './model/curriculum.model.js';
import './model/subjectAllocation.model.js';
import './model/classroom.model.js';
import './model/lectureSlot.model.js';
import './model/facultySchedule.model.js';
import './model/timetable.model.js';
import './model/roomAllocation.model.js';
import './model/attendance.model.js';

// ── Routes ────────────────────────────────────────────────────────────────
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import roleRoutes from './routes/role.routes.js';
import permissionRoutes from './routes/permission.routes.js';
import activityRoutes from './routes/activity.routes.js';
import departmentRoutes from './routes/department.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import academicRoutes from './routes/academic.routes.js';
import timetableRoutes from './routes/timetable.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';

// Models
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

// Define Associations
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

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
}));
app.use(express.json());
app.use("/api/users", adminRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions/definitions", permissionRoutes);
app.use("/api/activity-logs", activityRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/old-users", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Correct DB connection check
sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((e) => console.log("❌ DB Error:", e));

// Routes
app.get('/', (req, res) => {
  res.send('Attendance Management System API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'ok', message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Sync Database function
const syncDB = async () => {
  try {
    console.log("🔄 Starting DB Sync...");

    // Sync and seed Roles first to satisfy foreign key constraints for other models
    await Role.sync();
    await seedDefaultRoles();
    console.log("✅ Roles synced and seeded");

    await ActivityLog.sync();
    console.log("✅ ActivityLog synced");

    await sequelize.sync();
    console.log("✅ All models synced");

    await seedDefaultPermissions();
    console.log("✅ Default data seeded");

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`DB test: http://localhost:${PORT}/api/db-test`);
    });
  } catch (error) {
    console.error("❌ DB Sync Error:", error);
  }
};

syncDB();
