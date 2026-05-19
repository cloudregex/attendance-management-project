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
import roleRoutes from './routes/role.routes.js';
import permissionRoutes from './routes/permission.routes.js';
import activityRoutes from './routes/activity.routes.js';
import departmentRoutes from './routes/department.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';

// Models
import Admin from './model/admin.model.js';
import Role from './model/role.model.js';
import Permission from './model/permission.model.js';
import ActivityLog from './model/activityLog.model.js';
import usermodel from './model/user.model.js';
import { DataTypes } from 'sequelize';

// Define Associations
Role.belongsToMany(Permission, { through: 'RolePermissions', as: 'permissions' });
Permission.belongsToMany(Role, { through: 'RolePermissions', as: 'roles' });

// Services
import { seedDefaultRoles } from './services/role.service.js';
import { seedDefaultPermissions } from './services/permission.service.js';

const app = express();
const PORT = process.env.PORT || 5000;
const User = usermodel(sequelize, DataTypes);

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
app.use("/api/old-users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

// ✅ Correct DB connection check
sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((e) => console.log("❌ DB Error:", e));

// Routes
app.get('/', (req, res) => {
  res.send('Attendance Management System API is running...');
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
