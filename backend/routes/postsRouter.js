import express from "express";
import upload from "../utils/upload.js";
import {
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  likeComment,
  follow,
  like,
  getSinglePost,
} from "../controllers/postsController.js";
import { uploadProfilePicture } from "../controllers/userController.js";

const postsRouter = express.Router();

postsRouter.get("/", getPost);
postsRouter.get("/get-post/:id", getSinglePost);
postsRouter.post("/upload-post", upload.single("image"), createPost);
postsRouter.put("/update-post/:id", upload.single("image"), updatePost);
postsRouter.delete("/delete-post/:id", deletePost);
postsRouter.post("/add-comment/:id", addComment);
postsRouter.delete("/delete-comment/:id", deleteComment);
postsRouter.put("/like-comment/:id", likeComment);
postsRouter.put("/follow/:id", follow);
postsRouter.post("/like/:id", like);

export { postsRouter };
