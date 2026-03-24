import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';

// ── Import models so Sequelize knows about them before sync ───────────────
import './model/admin.model.js';
import './model/department.model.js';
import './model/student.model.js';
import './model/teacher.model.js';

// ── Routes ────────────────────────────────────────────────────────────────
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import departmentRoutes from './routes/department.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Route mounting ─────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/departments', departmentRoutes);

// General health route
app.get('/', (req, res) => {
  res.send('Attendance Management System API is running...');
});

// ── DB connect → sync → start server ──────────────────────────────────────
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: true }); // creates/updates tables, preserves data
  })
  .then(() => {
    console.log('✅ All models synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('❌ DB Error:', e);
    process.exit(1);
  });