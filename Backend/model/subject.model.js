import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Subject = sequelize.define('Subject', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    department_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    subject_type: {
        type: DataTypes.ENUM('core', 'elective', 'lab'),
        allowNull: false,
        defaultValue: 'core',
    },
    prerequisites: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    syllabus_url: {
        type: DataTypes.STRING,
    },
    syllabus_status: {
        type: DataTypes.ENUM('pending', 'uploaded', 'approved'),
        defaultValue: 'pending',
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'subjects',
    timestamps: true,
    underscored: true,
});

export default Subject;
