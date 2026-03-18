// models/student.model.js

const studentModel = (sequelize, DataTypes) => {
    const Student = sequelize.define(
        "Student",
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

    return Student;
};

export default studentModel;