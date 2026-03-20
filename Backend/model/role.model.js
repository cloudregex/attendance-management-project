import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            isLowercase: true,
            isAlphanumeric: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    // Administrative Permissions
    canGrant: { type: DataTypes.BOOLEAN, defaultValue: false },
    canApprove: { type: DataTypes.BOOLEAN, defaultValue: false },
    canManageUsers: { type: DataTypes.BOOLEAN, defaultValue: false },
    canManageRoles: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Attendance Permissions
    canTakeAttendance: { type: DataTypes.BOOLEAN, defaultValue: false },
    canViewReports: { type: DataTypes.BOOLEAN, defaultValue: false },
    canModifyRecords: { type: DataTypes.BOOLEAN, defaultValue: false },
    canExportData: { type: DataTypes.BOOLEAN, defaultValue: false },

    // System Permissions
    canAccessLogs: { type: DataTypes.BOOLEAN, defaultValue: false },
    canManageDepts: { type: DataTypes.BOOLEAN, defaultValue: false },
    canViewSchedules: { type: DataTypes.BOOLEAN, defaultValue: false },
    canSystemConfig: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: true
});

export default Role;
