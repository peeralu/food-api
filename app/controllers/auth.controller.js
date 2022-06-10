const db = require("../models");
const config = require("../config/auth.config");
const { success, error } = require("../models/response.model");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const e = require("cors");

exports.register = async (req, res) => {
  const newUser = await User.create({
    email: req.body.email,
    name: req.body.name,
    mobile: req.body.mobile,
    address: req.body.address,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  let accessToken = jwt.sign({ id: newUser.id }, config.secret, {
    expiresIn: config.jwtExpiration,
  });

  let refreshToken = await RefreshToken.createToken(newUser);

  res.status(200).json(
    success(
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          mobile: newUser.mobile,
          address: newUser.address,
        },
      },
      res.statusCode
    )
  );
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .json(
            error(
              "Invalid",
              "รหัสผ่านไม่ถูกต้อง",
              "Invalid Password",
              res.statusCode
            )
          );
      }

      let accessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      res.status(200).json(
        success(
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              mobile: user.mobile,
              address: user.address,
            },
          },
          res.statusCode
        )
      );
    } else {
      return res
        .status(400)
        .json(
          error(
            "Unauthorized",
            "ไม่มีสิทธิ์ในการทำรายการ",
            "There is no right to do the transaction.",
            res.statusCode
          )
        );
    }
  } catch (error) {}
};

exports.logout = async (req, res) => {
  if (req.userId > 0) {
    let refreshToken = await RefreshToken.findOne({
      where: {
        userId: req.userId,
      },
    });
    if (refreshToken) {
      RefreshToken.destroy({
        where: {
          userId: req.userId,
        },
      });
    }

    res.status(200).json(success(true, res.statusCode));
  } else {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลไม่ถูกต้อง",
          "Invalid information",
          res.statusCode
        )
      );
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res
      .status(403)
      .json(
        error(
          "Unauthorized",
          "ต้องใช้โทเค็นการรีเฟรช",
          "Refresh Token is required",
          res.statusCode
        )
      );
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: {
        token: requestToken,
      },
    });

    if (!refreshToken) {
      return res
        .status(403)
        .json(
          error(
            "Unauthorized",
            "โทเค็นการรีเฟรชไม่อยู่ในฐานข้อมูล",
            "Refresh token is not in database",
            res.statusCode
          )
        );
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({
        where: {
          id: refreshToken.id,
        },
      });

      return res
        .status(403)
        .json(
          error(
            "Unauthorized",
            "โทเค็นการรีเฟรชหมดอายุแล้ว กรุณาทำการร้องขอการเข้าสู่ระบบใหม่",
            "Refresh token was expired. Please make a new signin request",
            res.statusCode
          )
        );
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json(
      success(
        {
          accessToken: newAccessToken,
          refreshToken: refreshToken.token,
        },
        res.statusCode
      )
    );
  } catch (err) {
    return res
      .status(500)
      .json(
        error(
          "Server Error",
          "ข้อผิดพลาดภายในเซิร์ฟเวอร์",
          "Internal Server Error",
          res.statusCode
        )
      );
  }
};
