const db = require("../models");
const { success, error } = require("../models/response.model");

const Category = db.category;

exports.findAll = async (req, res) => {
    const category = await Category.findAll(
        {
            attributes: ['id', 'name', 'image']
        }
    );
    res
        .status(200)
        .json(success(category, res.statusCode));
};