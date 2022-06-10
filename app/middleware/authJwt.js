const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { error } = require("../models/response.model");
const db = require("../models");

const { TokenExpiredError } = jwt;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .json(
        error(
          "Unauthorized",
          "ไม่มีสิทธิ์ในการทำรายการ",
          "There is no right to do the transaction.",
          res.statusCode
        )
      );
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json(
          error(
            "Unauthorized",
            "ไม่มีสิทธิ์ในการทำรายการ",
            "There is no right to do the transaction.",
            res.statusCode
          )
        );
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;
