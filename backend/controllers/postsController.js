const User = require("../models/userModel");
const Post = require("../models/postModel");
const { verifyToken } = require("../utils/token");
const sharp = require("sharp"); // Assuming you are using sharp for image processing
const { convertImageToBase64, formatDate } = require("../utils/formaters");

const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profilePicture mimeType")
      .populate("comments.user", "name profilePicture mimeType")
      .populate("comments.replies.user", "name profilePicture mimeType");

    const formattedPosts = await Promise.all(
      posts.map(async (post) => ({
        ...post._doc,
        image: convertImageToBase64(post.image, post.mimeType),
        author: post.author
          ? {
              id: post.author._id,
              name: post.author.name,
              profilePicture: post.author.profilePicture
                ? convertImageToBase64(
                    post.author.profilePicture,
                    post.author.mimeType
                  )
                : "",
            }
          : null,
        comments: await Promise.all(
          post.comments.map(async (comment) => ({
            ...comment._doc,
            user: comment.user
              ? {
                  id: comment.user._id,
                  name: comment.user.name,
                  profilePicture: comment.user.profilePicture
                    ? convertImageToBase64(
                        comment.user.profilePicture,
                        comment.user.mimeType
                      )
                    : "",
                }
              : null,
            createdAt: formatDate(comment.createdAt),
            updatedAt: formatDate(comment.updatedAt),
            replies: await Promise.all(
              comment.replies.map(async (reply) => ({
                ...reply._doc,
                user: reply.user
                  ? {
                      id: reply.user._id,
                      name: reply.user.name,
                      profilePicture: reply.user.profilePicture
                        ? convertImageToBase64(
                            reply.user.profilePicture,
                            reply.user.mimeType
                          )
                        : "",
                    }
                  : null,
                createdAt: formatDate(reply.createdAt),
                updatedAt: formatDate(reply.updatedAt),
              }))
            ),
          }))
        ),
        createdAt: formatDate(post.createdAt),
        updatedAt: formatDate(post.updatedAt),
      }))
    );

    res.status(200).json({
      message: "Posts fetched successfully",
      status: "success",
      posts: formattedPosts,
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(200).json({ message: "Server error" });
  }
};

const createPost = async (req, res) => {
  const { id, title, caption } = req.body;
  const author = verifyToken(req.headers.authorization).id;
  const hashTags = caption.match(/#\w+/g) || []; // Extract hashtags from caption
  const tags = hashTags.map((tag) => tag.slice(1));
  if (id !== "") {
    const post = await Post.findById(id);
    if (post) {
      post.title = title;
      post.caption = caption;
      post.tags = tags;
      post.image = req.file.buffer;
      post.save();
      return res.status(200).json({
        message: "Post updated successfully",
        status: "success",
        post: post,
      });
    }
  }

  const newPost = new Post({
    title: title,
    caption: caption,
    author: author,
    tags: tags,
    image: req.file.buffer, // Assuming image is uploaded as a file
    mimeType: req.file.mimetype,
  });

  newPost
    .save()
    .then(async (createdPost) => {
      let authorDetails = await User.findById(author);
      if (!authorDetails) {
        return res.status(200).json({
          message: "Author not found",
          status: "error",
        });
      }
      authorDetails = {
        id: authorDetails._id,
        name: authorDetails.name,
        profilePicture: authorDetails.profilePicture
          ? convertImageToBase64(
              authorDetails.profilePicture,
              authorDetails.mimeType
            )
          : "",
      };
      const updatedPost = {
        ...createdPost._doc,
        image: convertImageToBase64(createdPost.image, createdPost.mimeType), // Convert image to base64 string
        author: authorDetails,
      };
      res.json({
        message: "Post created successfully",
        status: "success",
        post: updatedPost,
      });
      User.findByIdAndUpdate(author, { $push: { posts: createdPost._id } });
    })
    .catch((error) => {
      res.json({
        message: "Error creating post",
        status: "error",
        error: error.message,
      });
    });
};

const updatePost = (req, res) => {
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

const deletePost = (req, res) => {
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

const addComment = (req, res) => {
  const PostId = req.params.id;
  const { user, content, type } = req.body;
  console.log(req.body);

  // Validate required fields
  if (!user || !content || !type) {
    return res.status(200).json({
      message: "Missing required fields",
      status: "error",
    });
  }

  let commentId;
  // For replies, validate commentId exists
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
    // For replies, we need to find the specific comment and push to its replies array
    updateQuery = {
      $push: {
        "comments.$[comment].replies": { user, content },
      },
    };
  } else {
    // For top-level comments
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

const deleteComment = (req, res) => {
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

const likeComment = (req, res) => {
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

const like = (req, res) => {
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

const follow = async (req, res) => {
  const PostId = req.params.id;
  const userId = req.body.userId; // user who is following
  const followed = req.body.followed; // true = follow, false = unfollow

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

module.exports = {
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  likeComment,
  follow,
  like,
  convertImageToBase64,
  formatDate,
};
