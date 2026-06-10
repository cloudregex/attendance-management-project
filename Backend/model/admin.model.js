// models/admin.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import Role from "./role.model.js";

const Admin = sequelize.define("Admin", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  roleId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'admin',
    references: {
      model: Role,
      key: 'id'
    }
  }
});

Admin.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(Admin, { foreignKey: 'roleId' });

export default Admin;
