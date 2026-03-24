// models/teacher.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Teacher = sequelize.define(
    "Teacher",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        // ── Personal Info ──────────────────────────────────────────
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        middle_name: {
            type: DataTypes.STRING,
        },

        last_name: {
            type: DataTypes.STRING,
        },

        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },

        mobile: {
            type: DataTypes.STRING,
        },

        whatsapp_number: {
            type: DataTypes.STRING,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        gender: {
            type: DataTypes.STRING,
        },

        date_of_birth: {
            type: DataTypes.DATEONLY,
        },

        address: {
            type: DataTypes.TEXT,
        },

        city: {
            type: DataTypes.STRING,
        },

        state: {
            type: DataTypes.STRING,
        },

        pincode: {
            type: DataTypes.STRING,
        },

        // ── Teacher-Specific Info ──────────────────────────────────
        employee_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        department_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        designation: {
            type: DataTypes.STRING,
        },

        qualification: {
            type: DataTypes.STRING,
        },

        subjects: {
            type: DataTypes.JSON, // array of subjects
        },

        classes: {
            type: DataTypes.JSON, // array of classes handled
        },

        joining_date: {
            type: DataTypes.DATEONLY,
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "teachers",
        timestamps: true,
        underscored: true,
    }
);

export default Teacher;