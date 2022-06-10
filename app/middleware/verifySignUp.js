const db = require("../models");
const { success, error } = require("../models/response.model");
const User = db.user;

const checkRegister = (req, res, next) => {
  if (!req.body.email) {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการลงทะเบียนไม่ถูกต้อง",
          "Invalid registration information",
          res.statusCode
        )
      );
  }

  if (!req.body.name) {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการลงทะเบียนไม่ถูกต้อง",
          "Invalid registration information",
          res.statusCode
        )
      );
  }

  if (!req.body.mobile) {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการลงทะเบียนไม่ถูกต้อง",
          "Invalid registration information",
          res.statusCode
        )
      );
  }

  if (!req.body.address) {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการลงทะเบียนไม่ถูกต้อง",
          "Invalid registration information",
          res.statusCode
        )
      );
  }

  if (!req.body.password) {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการลงทะเบียนไม่ถูกต้อง",
          "Invalid registration information",
          res.statusCode
        )
      );
  }

  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json(
          error(
            "Invalid",
            "ข้อมูลการลงทะเบียนไม่ถูกต้อง",
            "Invalid registration information",
            res.statusCode
          )
        );
    }
    next();
  });
};

const checkLogin = (req, res, next) => {
  if (!req.body.email) {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการไม่ถูกต้อง",
          "Invalid information",
          res.statusCode
        )
      );
  }

  if (!req.body.password) {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการไม่ถูกต้อง",
          "Invalid information",
          res.statusCode
        )
      );
  }

  next();
};

const verifySignUp = {
  checkLogin: checkLogin,
  checkRegister: checkRegister,
};

module.exports = verifySignUp;
