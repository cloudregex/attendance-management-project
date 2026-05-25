import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const RoomAllocation = sequelize.define('RoomAllocation', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    timetable_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    classroom_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    lecture_slot_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    allocation_status: {
        type: DataTypes.ENUM('reserved', 'released'),
        defaultValue: 'reserved',
    },
}, {
    tableName: 'room_allocation',
    timestamps: true,
    underscored: true,
});

export default RoomAllocation;
