import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Curriculum = sequelize.define('Curriculum', {
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
    academic_year: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    plan_version: {
        type: DataTypes.STRING,
        defaultValue: 'v1',
    },
    is_mandatory: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    notes: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'curriculum',
    timestamps: true,
    underscored: true,
});

export default Curriculum;
