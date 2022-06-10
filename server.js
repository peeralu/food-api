const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3333",
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// handle error
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500);
  res.send(err);
});

// database
require("./app/database/database");

// route
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/category.routes.js")(app);
require("./app/routes/food.routes.js")(app);

app.get("*", (req, res) => {
  res.json({ message: "Welcome to Training Bootcamp" });
});

// set port, listen for requests
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
