const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/login", [verifySignUp.checkLogin], controller.login);
  app.post("/api/auth/logout", [authJwt.verifyToken], controller.logout);
  app.post(
    "/api/auth/refreshtoken",
    [authJwt.verifyToken],
    controller.refreshToken
  );
  app.post(
    "/api/auth/register",
    [verifySignUp.checkRegister],
    controller.register
  );
};
