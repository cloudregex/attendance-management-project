import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    timetable_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
        defaultValue: 'present',
    },
    remarks: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'attendance',
    timestamps: true,
    underscored: true,
});

export default Attendance;
