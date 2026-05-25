import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Timetable = sequelize.define('Timetable', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    course_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    semester_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    subject_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    teacher_id: {
        type: DataTypes.BIGINT,
    },
    department_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    lecture_slot_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    classroom_id: {
        type: DataTypes.BIGINT,
    },
    academic_year: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timetable_status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft',
    },
    source_allocation_id: {
        type: DataTypes.BIGINT,
    },
    notes: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'timetable',
    timestamps: true,
    underscored: true,
});

export default Timetable;
