const express = require("express");
const userRouter = express.Router();
const {
  login,
  signup,
  updateUser,
  deleteUser,
  uploadProfilePicture,
  follow,
  forgetPassword,
  dashboard,
  getAllPosts,
} = require("../controllers/userController");
const upload = require("../utils/upload");

userRouter.get("/dashboard", dashboard);
userRouter.post("/login", upload.none(), login);
userRouter.post("/signup", upload.none(), signup);
userRouter.put("/update-profile", upload.none(), updateUser);
userRouter.delete("/", deleteUser);
userRouter.put("/:id/follow", follow);
userRouter.put(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  uploadProfilePicture
);
userRouter.get("/posts", getAllPosts);
userRouter.post("/forgot-password", forgetPassword);

module.exports = {
  userRouter,
};
