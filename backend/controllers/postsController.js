import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { verifyToken } from "../utils/token.js";
import { formatDate } from "../utils/formaters.js";

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profilePicture mimeType")
      .populate("comments.user", "name profilePicture mimeType")
      .populate("comments.replies.user", "name profilePicture mimeType");

    res.status(200).json({
      message: "Posts fetched successfully",
      status: "success",
      posts: posts,
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(200).json({ message: "Server error" });
  }
};

export const createPost = async (req, res) => {
  const { id, caption } = req.body;
  const author = verifyToken(req.headers.authorization).id;
  const hashTags = caption.match(/#\w+/g) || [];
  const tags = hashTags.map((tag) => tag.slice(1));
  if (id !== "") {
    const post = await Post.findById(id);
    if (post) {
      post.caption = caption;
      post.tags = tags;
      post.image = req.file.path;
      post.save();
      return res.status(200).json({
        message: "Post updated successfully",
        status: "success",
        post: post,
      });
    }
  }

  const newPost = new Post({
    caption: caption,
    author: author,
    tags: tags,
    image: req.file.path,
    mimeType: req.file.mimetype,
  });

  newPost
    .save()
    .then(async (createdPost) => {
      const user = await User.findById(author);
      user.posts.push(createdPost._id);
      await user.save();
      res.status(200).json({
        message: "Post created successfully",
        status: "success",
        post: createdPost,
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error creating post",
        status: "error",
        error: error.message,
      });
    });
};

export const updatePost = (req, res) => {
  const PostId = req.params.id;
  const updatedData = req.body;
  Post.findByIdAndUpdate(PostId, updatedData, { new: true })
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(200).json({
          message: "Post not found",
          status: "error",
        });
      }
      res.status(200).json({
        message: "Post updated successfully",
        status: "success",
        data: updatedPost,
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error updating post",
        status: "error",
        error: error.message,
      });
    });
};

export const deletePost = (req, res) => {
  const PostId = req.params.id;
  Post.findByIdAndDelete(PostId)
    .then((deletedPost) => {
      if (!deletedPost) {
        return res.status(200).json({
          message: "Post not found",
          status: "error",
        });
      }
      res.status(200).json({
        message: "Post deleted successfully",
        status: "success",
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error deleting post",
        status: "error",
        error: error.message,
      });
    });
};

export const addComment = (req, res) => {
  const PostId = req.params.id;
  const { user, content, type } = req.body;
  console.log(req.body);

  if (!user || !content || !type) {
    return res.status(200).json({
      message: "Missing required fields",
      status: "error",
    });
  }

  let commentId;
  if (type === "reply") {
    commentId = req.body.commentId;
    if (!commentId) {
      return res.status(200).json({
        message: "Missing commentId for reply",
        status: "error",
      });
    }
  }

  let updateQuery;

  if (type === "reply") {
    updateQuery = {
      $push: {
        "comments.$[comment].replies": { user, content },
      },
    };
  } else {
    updateQuery = {
      $push: { comments: { user, content } },
    };
  }

  const options = {
    new: true,
    arrayFilters: type === "reply" ? [{ "comment._id": commentId }] : undefined,
  };

  Post.findByIdAndUpdate(PostId, updateQuery, options)
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(200).json({
          message: "Post not found",
          status: "error",
        });
      }
      res.status(200).json({
        message: "Comment added successfully",
        status: "success",
        post: updatedPost,
      });
    })
    .catch((error) => {
      console.error("Error adding comment:", error);
      res.status(200).json({
        message: "Error adding comment",
        status: "error",
        error: error.message,
      });
    });
};

export const deleteComment = (req, res) => {
  const PostId = req.params.id;
  const { commentId } = req.body;

  Post.findByIdAndUpdate(
    PostId,
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(200).json({
          message: "Post not found",
          status: "error",
        });
      }
      res.status(200).json({
        message: "Comment deleted successfully",
        status: "success",
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error deleting comment",
        status: "error",
        error: error.message,
      });
    });
};

export const likeComment = (req, res) => {
  const PostId = req.params.id;
  const { commentId } = req.body;
  const userId = req.body.userId;
  const liked = req.body.liked;

  const updateQuery =
    liked === false
      ? { $addToSet: { "comments.$[comment].likes": userId } }
      : { $pull: { "comments.$[comment].likes": userId } };

  Post.findByIdAndUpdate(PostId, updateQuery, {
    new: true,
    arrayFilters: [{ "comment._id": commentId }],
  })
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(200).json({
          message: "Post not found",
          status: "error",
        });
      }
      res.status(200).json({
        message: "Comment liked successfully",
        status: "success",
      });
    })
    .catch((error) => {
      console.log("Error liking comment:");
      res.status(200).json({
        message: "Error liking comment",
        status: "error",
        error: error.message,
      });
    });
};

export const like = (req, res) => {
  const PostId = req.params.id;
  const userId = req.body.userId;
  const liked = req.body.liked;
  console.log(req.body);

  const updateQuery = liked
    ? { $addToSet: { likes: userId } }
    : { $pull: { likes: userId } };

  Post.findByIdAndUpdate(PostId, updateQuery, { new: true })
    .then((updatedPost) => {
      if (!updatedPost) {
        console.log("Post not found");
        return res.status(200).json({
          message: "Post not found",
          status: "error",
        });
      }
      res.status(200).json({
        message: "Post liked successfully",
        status: "success",
      });
    })
    .catch((error) => {
      console.log("Error liking post:");
      res.status(200).json({
        message: "Error liking post",
        status: "error",
        error: error.message,
      });
    });
};

export const follow = async (req, res) => {
  const PostId = req.params.id;
  const userId = req.body.userId;
  const followed = req.body.followed;

  try {
    const post = await Post.findById(PostId).populate("author");
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", status: "error" });
    }

    const authorId = post.author._id;

    const update = followed
      ? { $addToSet: { followers: userId } }
      : { $pull: { followers: userId } };

    await User.findByIdAndUpdate(authorId, update);

    const follower = await User.findById(userId);
    if (!follower) {
      return res
        .status(404)
        .json({ message: "Follower not found", status: "error" });
    }

    const following = followed
      ? { $addToSet: { following: authorId } }
      : { $pull: { following: authorId } };

    await User.findByIdAndUpdate(userId, following);

    res.status(200).json({
      message: followed ? "Author followed successfully" : "Author unfollowed",
      status: "success",
    });
  } catch (error) {
    console.log("Error following author:", error.message);
    res.status(500).json({
      message: "Error following author",
      status: "error",
      error: error.message,
    });
  }
};

export const getSinglePost = async (req, res) => {
  const PostId = req.params.id;
  try {
    const post = await Post.findById(PostId)
      .populate("author")
      .populate(
        "comments.user comments.user.profilePicture comments.user.mimeType"
      )
      .populate(
        "comments.replies.user comments.replies.user.profilePicture comments.replies.user.mimeType"
      );
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", status: "error" });
    }
    res.status(200).json({
      message: "Post retrieved successfully",
      status: "success",
      post: post,
    });
  } catch (error) {
    console.log("Error getting post:", error.message);
    res.status(500).json({
      message: "Error getting post",
      status: "error",
      error: error.message,
    });
  }
};

// Optionally export helpers if needed elsewhere
export { formatDate };
