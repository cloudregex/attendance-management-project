// config/db.js
import { Sequelize } from "sequelize";

// Helper to remove accidental quotes and trailing spaces from cloud env variables
const sanitizeEnv = (val) => val ? val.replace(/['"]/g, '').trim() : '';

const sequelize = new Sequelize(
  sanitizeEnv(process.env.DB_NAME),
  sanitizeEnv(process.env.DB_USER),
  sanitizeEnv(process.env.DB_PASSWORD),
  {
    host: sanitizeEnv(process.env.DB_HOST),
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

export default sequelize;