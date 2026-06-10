import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FacultySchedule = sequelize.define('FacultySchedule', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    teacher_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    day_of_week: {
        type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    availability_status: {
        type: DataTypes.ENUM('available', 'unavailable'),
        defaultValue: 'available',
    },
    reason: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'faculty_schedule',
    timestamps: true,
    underscored: true,
});

export default FacultySchedule;
