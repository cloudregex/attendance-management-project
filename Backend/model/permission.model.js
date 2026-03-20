import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Permission = sequelize.define('Permission', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Permission name already exists" },
        validate: {
            notEmpty: { msg: "Permission name is required" },
            len: [2, 100]
        }
    }
}, {
    timestamps: true
});

export default Permission;
