import express from "express";
import { homePage } from "../controllers/mainController.js";
const mainRouter = express.Router();

mainRouter.get("/", homePage);

export { mainRouter };
