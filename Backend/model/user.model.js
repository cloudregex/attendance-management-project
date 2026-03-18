const usermodel = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

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

    role: {
      type: DataTypes.ENUM("student", "teacher", "admin"),
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

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

  }, {
    tableName: "users",
    timestamps: true,
    underscored: true,
  });

  return User;
};

export default usermodel;