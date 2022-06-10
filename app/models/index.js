const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
// const sequelize = new Sequelize(config.SQLITE)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database/food.sqlite",
});
// const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
//     host: config.HOST,
//     dialect: config.dialect
// })

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(
  sequelize,
  Sequelize
);
db.category = require("../models/category.model.js")(sequelize, Sequelize);
db.food = require("../models/food.model.js")(sequelize, Sequelize);
db.favorite = require("../models/favorite.model.js")(sequelize, Sequelize);

// many to many user <-> role
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

// one to many user - refreshToken
db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});

// one to many category -> food
db.food.belongsTo(db.category, {
  foreignKey: "categoryId",
  targetKey: "id",
});
db.category.hasMany(db.food, {
  foreignKey: "categoryId",
  targetKey: "id",
});

// one to many user <-> food
db.food.belongsToMany(db.user, {
  through: db.favorite,
  foreignKey: "foodId",
  otherKey: "userId",
});
db.user.belongsToMany(db.food, {
  through: db.favorite,
  foreignKey: "userId",
  otherKey: "foodId",
});

db.ROLES = ["user", "admin"];

module.exports = db;
