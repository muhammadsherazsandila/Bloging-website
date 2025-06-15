import express from "express";
import { mainRouter } from "./routes/mainRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { postsRouter } from "./routes/postsRouter.js";
import "./db/mongooseConnection.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);
app.use("/user", userRouter);
app.use("/post", postsRouter);

app.listen(5000, () => console.log("Server is running on port 5000"));
export default app;
