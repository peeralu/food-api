const { authJwt } = require("../middleware");
const controller = require("../controllers/food.controller");
const fs = require("fs");

let rawdata = fs.readFileSync("mPOSData.json");
// let student = JSON.parse(rawdata);

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

  app.get("/api/food/data/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(rawdata);
  });
};
