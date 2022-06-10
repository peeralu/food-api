const db = require("../models");
const { success, error } = require("../models/response.model");

const User = db.user;

exports.findAll = async (req, res) => {
    const users = await User.findAll();
    res
        .status(200)
        .json(success(users, res.statusCode));
};
