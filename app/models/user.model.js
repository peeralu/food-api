module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    mobile: {
      type: Sequelize.STRING,
      defaultValue: "-",
    },
    address: {
      type: Sequelize.STRING,
      defaultValue: "-",
    },
    password: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
