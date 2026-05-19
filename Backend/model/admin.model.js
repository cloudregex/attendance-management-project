// models/admin.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Admin = sequelize.define("Admin", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default Admin;
