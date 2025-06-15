const express = require("express");
const { mainRouter } = require("./routes/mainRouter");
const { userRouter } = require("./routes/userRouter");
const { postsRouter } = require("./routes/postsRouter");
require("./db/mongooseConnection");
require("dotenv").config();
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);
app.use("/user", userRouter);
app.use("/post", postsRouter);
app.listen(5000, () => console.log("Server is running on port 5000"));
module.exports = app;
