module.exports = (sequelize, Sequelize) => {
    const Food = sequelize.define("food", {
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
        },
        starRating: {
            type: Sequelize.DOUBLE,
            defaultValue: 0.0
        },
        price: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });

    return Food;
};