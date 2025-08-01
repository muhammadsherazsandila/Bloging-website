import express from "express";
import {
  login,
  signup,
  updateUser,
  deleteUser,
  uploadProfilePicture,
  follow,
  forgetPassword,
  dashboard,
  getAllPosts,
  getAuthor,
  resetPassword,
  verifyPassToken,
} from "../controllers/userController.js";
import upload from "../utils/upload.js";

const userRouter = express.Router();

userRouter.get("/dashboard", dashboard);
userRouter.post("/login", upload.none(), login);
userRouter.post("/signup", upload.none(), signup);
userRouter.put("/update-profile", upload.none(), updateUser);
userRouter.delete("/", deleteUser);
userRouter.put("/follow/:id", follow);
userRouter.put(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  uploadProfilePicture
);
userRouter.get("/posts/:id", getAllPosts);
userRouter.post("/forgot-password", forgetPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/verify-token", verifyPassToken);
userRouter.delete("/delete-profile", deleteUser);
userRouter.get("/:id", getAuthor);

export { userRouter };
