import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import Role from './model/role.model.js';
import User from './model/admin.model.js';
import Permission from './model/permission.model.js';
import { seedDefaultRoles } from './services/role.service.js';
import { seedDefaultPermissions } from './services/permission.service.js';
import adminRoutes from './routes/admin.routes.js';
import roleRoutes from './routes/role.routes.js';
import permissionRoutes from './routes/permission.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", adminRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions/definitions", permissionRoutes);

app.get('/', (req, res) => {
  res.send('Attendance Management System API is running...');
});

// Sync Database in specific order to handle foreign keys
const syncDB = async () => {
  try {
    // 1. Sync Role and Permission models
    await Role.sync({ alter: true });
    await Permission.sync({ alter: true });
    console.log("✅ Role and Permission tables synced");

    // 2. Seed data
    await seedDefaultRoles();
    await seedDefaultPermissions();
    console.log("✅ Default data seeded");

    // 3. Now sync User model (depends on Role)
    await User.sync({ alter: true });
    console.log("✅ User table synced");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB Sync Error:", error);
  }
};

syncDB();