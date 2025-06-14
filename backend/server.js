const express = require("express");
const { mainRouter } = require("./routes/mainRouter");
const { userRouter } = require("./routes/userRouter");
const { postsRouter } = require("./routes/postsRouter");

const app = express();

const cors = require("cors");
app.use(cors());

const serverless = require("serverless-http");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);
app.use("/user", userRouter);
app.use("/post", postsRouter);

require("./db/mongooseConnection");
const debug = require("debug")("app:server");

module.exports.handler = serverless(app);
