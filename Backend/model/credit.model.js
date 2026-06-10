import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Credit = sequelize.define('Credit', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    subject_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
    },
    lecture: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    tutorial: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    practical: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    total: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'credits',
    timestamps: true,
    underscored: true,
});

export default Credit;
