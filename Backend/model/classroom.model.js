import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Classroom = sequelize.define('Classroom', {
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
    room_type: {
        type: DataTypes.ENUM('lecture', 'lab', 'seminar'),
        allowNull: false,
        defaultValue: 'lecture',
    },
    capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
    },
    department_id: {
        type: DataTypes.BIGINT,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'classrooms',
    timestamps: true,
    underscored: true,
});

export default Classroom;
