const db = require("../models");
const { success, error } = require("../models/response.model");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

const Category = db.category;
const Food = db.food;
const User = db.user;
const Favorite = db.favorite;

exports.findAll = async (req, res) => {
  const categoryList = await Category.findAll({
    attributes: ["id", "name", "image"],
  });
  const foodList = await Food.findAll({
    attributes: ["id", "name", "image", "detail", "starRating", "categoryId"],
  });

  const result = categoryList.map((category) => {
    const foods = foodList
      .filter((food) => {
        return category.id == food.categoryId;
      })
      .map((food) => {
        var detail = food.detail;
        if (detail.length > 50) {
          detail = detail.substring(0, 50) + "...";
        }
        return {
          id: food.id,
          name: food.name,
          image: food.image,
          detail: detail,
          starRating: food.starRating,
          category: category.name,
        };
      });

    return {
      id: category.id,
      name: category.name,
      image: category.image,
      menu: foods,
    };
  });
  const buffer = Buffer.from(result);
  res.set("Content-Length", buffer.length);
  res.status(200).json(success(result, res.statusCode));
};

exports.findByCategory = async (req, res) => {
  if (req.body.categoryId) {
    const foods = await Food.findAll({
      where: {
        categoryId: req.body.categoryId,
      },
      attributes: ["id", "name", "image", "starRating"],
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: User,
        },
      ],
    });

    const result = foods.map((data) => {
      return {
        id: data.id,
        name: data.name,
        image: data.image,
        starRating: data.starRating,
        category: data.category.name,
      };
    });
    const buffer = Buffer.from(result);
    res.set("Content-Length", buffer.length);
    res.status(200).json(success(result, res.statusCode));
  } else {
    res.status(401).json(error("food not found", 401));
  }
};

exports.findDetail = async (req, res) => {
  if (req.body.foodId) {
    const food = await Food.findOne({
      where: {
        id: req.body.foodId,
      },
      attributes: ["id", "name", "image", "detail", "starRating", "price"],
      include: [
        {
          model: Category,
          attributes: [["name", "category"]],
        },
        {
          model: User,
          attributes: ["id"],
        },
      ],
    });

    const result = {
      id: food.id,
      name: food.name,
      image: food.image,
      detail: food.detail,
      starRating: food.starRating,
      price: food.price,
      isFavorite: food.users.length > 0,
    };
    res.status(200).json(success(result, res.statusCode));
  } else {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการอาหารไม่ถูกต้อง",
          "Invalid food information",
          res.statusCode
        )
      );
  }
};

exports.favoriteFood = async (req, res) => {
  if (req.body.foodId) {
    let accessToken = req.headers["x-access-token"];
    jwt.verify(accessToken, config.secret, async (err, decoded) => {
      if (err) {
        return catchError(err, res);
      }

      const favorite = await Favorite.findOne({
        where: {
          userId: decoded.id,
          foodId: req.body.foodId,
        },
      });

      var message = "";
      if (favorite === null) {
        Favorite.create({
          userId: decoded.id,
          foodId: req.body.foodId,
        });
        message = "add favorite success";
      } else {
        favorite.destroy();
        message = "remove favorite success";
      }
      res.status(200).json(
        success(
          {
            meaasge: message,
          },
          res.statusCode
        )
      );
    });
  } else {
    return res
      .status(400)
      .json(
        error(
          "Invalid",
          "ข้อมูลการอาหารไม่ถูกต้อง",
          "Invalid food information",
          res.statusCode
        )
      );
  }
};
