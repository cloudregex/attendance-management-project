import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SubjectAllocation = sequelize.define('SubjectAllocation', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    subject_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    semester_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    department_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    teacher_id: {
        type: DataTypes.BIGINT,
    },
    academic_year: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    weekly_periods: {
        type: DataTypes.INTEGER,
        defaultValue: 4,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'subject_allocation',
    timestamps: true,
    underscored: true,
});

export default SubjectAllocation;
