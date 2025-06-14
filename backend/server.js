const express = require("express");
const { mainRouter } = require("./routes/mainRouter");
const { userRouter } = require("./routes/userRouter");
const { postsRouter } = require("./routes/postsRouter");

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);
app.use("/user", userRouter);
app.use("/post", postsRouter);

require("./db/mongooseConnection");
const debug = require("debug")("app:server");

app.listen(3000, () => {
  debug("Server is running on port 3000");
});
