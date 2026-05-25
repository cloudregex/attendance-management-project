import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const LectureSlot = sequelize.define('LectureSlot', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
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
    slot_type: {
        type: DataTypes.ENUM('lecture', 'lab', 'break', 'lunch'),
        allowNull: false,
        defaultValue: 'lecture',
    },
    sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'lecture_slots',
    timestamps: true,
    underscored: true,
});

export default LectureSlot;
