import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const NotificationToken = sequelize.define('NotificationToken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Optional: The ID of the user this token belongs to"
  }
}, {
  timestamps: true,
  tableName: 'notification_tokens'
});

export default NotificationToken;
