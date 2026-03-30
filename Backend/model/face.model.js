// models/face.model.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Face = sequelize.define(
    "Face",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        student_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        image_type: {
            type: DataTypes.ENUM("front", "left", "right"),
        },

        image_path: {
            type: DataTypes.STRING,
        },

        face_embedding: {
            type: DataTypes.TEXT,
        },

        model_version: {
            type: DataTypes.STRING,
        },

        captured_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "faces",
        timestamps: true,
        underscored: true,
    }
);
export default Face;