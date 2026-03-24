// models/department.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Department = sequelize.define(
    "Department",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        code: {
            type: DataTypes.STRING,
            unique: true,
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "departments",
        timestamps: true,
        underscored: true,
    }
);

export default Department;
