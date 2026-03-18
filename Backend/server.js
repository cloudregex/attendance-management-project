import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);


// ✅ Correct DB connection check
sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((e) => console.log("❌ DB Error:", e));

// Routes

// General route
app.get('/', (req, res) => {
  res.send('Attendance Management System API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`DB test: http://localhost:${PORT}/api/db-test`);
});