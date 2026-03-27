import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ActivityLog = sequelize.define('ActivityLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Null if system action or if we can't track (though we aim to)
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false // e.g., 'CREATE_USER', 'UPDATE_ROLE', 'DELETE_PERMISSION'
    },
    entityType: {
        type: DataTypes.STRING,
        allowNull: false // e.g., 'User', 'Role', 'Permission'
    },
    entityId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    timestamps: true,
    updatedAt: false // Logs are immutable
});

export default ActivityLog;
