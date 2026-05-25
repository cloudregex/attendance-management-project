import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Course = sequelize.define('Course', {
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
    duration_semesters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 8,
    },
    academic_year: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'courses',
    timestamps: true,
    underscored: true,
});

export default Course;
