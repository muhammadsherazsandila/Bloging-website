const express = require("express");
const { homePage } = require("../controllers/mainController");
const mainRouter = express.Router();

mainRouter.get("/", homePage);

module.exports = {
  mainRouter,
};
