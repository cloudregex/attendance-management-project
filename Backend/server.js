import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import sequelize from './config/db.js';

// ── Import models so Sequelize knows about them before sync ───────────────
import './model/admin.model.js';
import './model/department.model.js';
import './model/student.model.js';
import './model/teacher.model.js';
import './model/notificationToken.model.js';

// ── Routes ────────────────────────────────────────────────────────────────
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import departmentRoutes from './routes/department.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
}));
app.use(express.json());
app.use(cookieParser());

// ── Route mounting ─────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/notifications', notificationRoutes);

// General health route
app.get('/', (req, res) => {
  res.send('Attendance Management System API is running...');
});

// ── DB connect → sync → start server ──────────────────────────────────────
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync(); // sync without alter to avoid index limit issues
  })
  .then(() => {
    console.log('✅ All models synced');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('❌ DB Error:', e);
    process.exit(1);
  });