const express = require("express");
const upload = require("../utils/upload");
const postsRouter = express.Router();
const {
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  likeComment,
  follow,
  like,
} = require("../controllers/postsController");
const { uploadProfilePicture } = require("../controllers/userController");

postsRouter.get("/", getPost);
postsRouter.post("/upload-post", upload.single("image"), createPost);
postsRouter.put("/update-post/:id", upload.single("image"), updatePost);
postsRouter.delete("/delete-post/:id", deletePost);
postsRouter.post("/add-comment/:id", addComment);
postsRouter.delete("/delete-comment/:id", deleteComment);
postsRouter.put("/like-comment/:id", likeComment);
postsRouter.put("/follow/:id", follow);
postsRouter.post("/like/:id", like);

module.exports = {
  postsRouter,
};
