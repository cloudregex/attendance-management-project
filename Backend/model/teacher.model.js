// models/teacher.model.js

const teacherModel = (sequelize, DataTypes) => {
    const Teacher = sequelize.define(
        "Teacher",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },

            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },

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

    return Teacher;
};

export default teacherModel;