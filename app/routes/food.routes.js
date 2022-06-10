const { authJwt } = require("../middleware");
const controller = require("../controllers/food.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/food/list/", [authJwt.verifyToken], controller.findAll);

  app.post("/api/food/detail/", [authJwt.verifyToken], controller.findDetail);

  app.post(
    "/api/food/favorite/",
    [authJwt.verifyToken],
    controller.favoriteFood
  );
};
