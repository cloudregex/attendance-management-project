// models/student.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Student = sequelize.define(
    "Student",
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

        // ── Student-Specific Info ──────────────────────────────────
        roll_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        department_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        course: {
            type: DataTypes.STRING,
        },

        class_name: {
            type: DataTypes.STRING,
        },

        semester: {
            type: DataTypes.STRING,
        },

        admission_year: {
            type: DataTypes.STRING,
        },

        parent_name: {
            type: DataTypes.STRING,
        },

        parent_mobile: {
            type: DataTypes.STRING,
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "students",
        timestamps: true,
        underscored: true,
    }
);

export default Student;