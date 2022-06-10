module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        detail: {
            type: Sequelize.TEXT
        },
        image: {
            type: Sequelize.STRING
        }
    });

    return Category;
};
