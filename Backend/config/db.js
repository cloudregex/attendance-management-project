// config/db.js
import { Sequelize } from "sequelize";

// Helper to remove accidental quotes and trailing spaces from cloud env variables
const sanitizeEnv = (val) => val ? val.replace(/['"]/g, '').trim() : '';

const dialectOptions = {};
if (sanitizeEnv(process.env.DB_SSL) === 'true') {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false
  };
}

const sequelize = new Sequelize(
  sanitizeEnv(process.env.DB_NAME),
  sanitizeEnv(process.env.DB_USER),
  sanitizeEnv(process.env.DB_PASSWORD),
  {
    host: sanitizeEnv(process.env.DB_HOST),
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions
  }
);

export default sequelize;