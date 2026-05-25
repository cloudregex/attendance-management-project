import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Semester = sequelize.define('Semester', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    course_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    semester_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'semesters',
    timestamps: true,
    underscored: true,
});

export default Semester;
