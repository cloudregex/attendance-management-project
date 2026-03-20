import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Role from "./role.model.js";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name is required" },
      len: { args: [2, 50], msg: "Name must be between 2 and 50 characters" }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Email already exists" },
    validate: {
      isEmail: { msg: "Please enter a valid email address" }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password is required" },
      len: { args: [8, 100], msg: "Password must be at least 8 characters long" }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Phone number is required" },
      is: {
        args: [/^[+]?[1-9][\d]{9,14}$/],
        msg: "Please enter a valid phone number"
      }
    }
  },
  roleId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Individual Permission Overrides
  canGrant: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canApprove: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canManageUsers: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canManageRoles: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canTakeAttendance: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canViewReports: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canModifyRecords: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canExportData: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canAccessLogs: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canManageDepts: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canViewSchedules: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true },
  canSystemConfig: { type: DataTypes.BOOLEAN, defaultValue: null, allowNull: true }
});

// Associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId' });

export default User;