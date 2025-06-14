const User = require("../models/userModel");
const Post = require("../models/postModel");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../utils/token");
const { sendEmail } = require("../utils/resetPass");
const sharp = require("sharp");
const { convertImageToBase64, formatDate } = require("../utils/formaters");
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.status(200).json({
          message: "User not found",
          status: "error",
        });
      }
      // Compare the provided password with the stored hashed password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(200).json({
          message: "Invalid password",
          status: "error",
        });
      }
      let pngBuffer = null;
      if (user.profilePicture) {
        pngBuffer = await sharp(user.profilePicture).png().toBuffer();
      }

      const updatedUser = {
        name: user.name,
        profilePicture: pngBuffer?.toString("base64"), // send as base64 string for frontend use
        followers: user.followers.length,
        following: user.following.length,
        bio: user.bio || "", // Include bio if it exists
      };
      res.status(200).json({
        message: "Login successful",
        status: "success",
        user: updatedUser,
        token: generateToken(user), // Assuming generateToken is a function that generates a JWT token
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error logging in",
        status: "error",
        error: error.message,
      });
    });
};

const signup = (req, res) => {
  if (!req.body) {
    return res.status(200).json({
      message: "having no body",
    });
  }
  const { name, email, password } = req.body;
  const pass = bcrypt.hashSync(password, 10); // Hash the password
  const newUser = new User({ name, email, password: pass });
  // Save the new user to the database
  newUser
    .save()
    .then(async (user) => {
      let pngBuffer = null;
      if (user.profilePicture) {
        pngBuffer = await sharp(user.profilePicture).png().toBuffer();
      }

      const updatedUser = {
        name: user.name,
        profilePicture: pngBuffer?.toString("base64"), // send as base64 string for frontend use
        followers: user.followers.length,
        following: user.following.length,
        bio: user.bio || "", // Include bio if it exists
      };
      // Generate a token for the user
      res.status(200).json({
        message: "User created successfully",
        status: "success",
        user: updatedUser,
        token: generateToken(user), // Assuming generateToken is a function that generates a JWT token
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "User Already Exist!",
        status: "error",
        error: error.message,
      });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(verifyToken(req.headers.authorization).id, req.body, {
    new: true,
  })
    .then(async (user) => {
      if (!user) {
        return res.status(200).json({
          message: "User not found!",
          status: "error",
        });
      }
      let pngBuffer = null;
      if (user.profilePicture) {
        pngBuffer = await sharp(user.profilePicture).png().toBuffer();
      }

      const updatedUser = {
        name: user.name,
        profilePicture: pngBuffer?.toString("base64"), // send as base64 string for frontend use
        followers: user.followers.length,
        following: user.following.length,
        bio: user.bio || "", // Include bio if it exists
      };
      if (req.body.password) {
        updatedUser.password = req.body.password;
      }
      res.status(200).json({
        message: "User updated successfully",
        status: "success",
        user: updatedUser,
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error updating user",
        status: "error",
        error: error.message,
      });
    });
};

const deleteUser = (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(200).json({
          message: "User not found",
          status: "error",
        });
      }
      res.status(200).json({
        message: "User deleted successfully",
        status: "success",
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error deleting user",
        status: "error",
        error: error.message,
      });
    });
};

const uploadProfilePicture = async (req, res) => {
  if (req.body) {
    const token = verifyToken(req.headers.authorization);
    const user = await User.findOne({ _id: token.id });
    if (!user) {
      return res.json({
        message: "Unauthorized",
      });
    }
    user.profilePicture = req.file.buffer;
    user.mimeType = req.file.mimetype;
    await user.save();

    const updatedUser = {
      name: user.name,
      profilePicture: convertImageToBase64(user.profilePicture, user.mimeType), // send as base64 string for frontend use
      followers: user.followers.length,
      following: user.following.length,
      bio: user.bio || "", // Include bio if it exists
    };
    return res.json({
      message: "uploaded",
      user: updatedUser,
      status: "success",
    });
  } else {
    return res.json({
      message: "no body",
    });
  }
};

const follow = (req, res) => {
  const userId = req.params.id;
  const followerId = req.body.followerId;

  User.findByIdAndUpdate(
    userId,
    { $addToSet: { followers: followerId } },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(200).json({
          message: "User not found",
          status: "error",
        });
      }
      res.status(200).json({
        message: "User followed successfully",
        status: "success",
        data: updatedUser,
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error following user",
        status: "error",
        error: error.message,
      });
    });
};

const forgetPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          message: "User not found",
          status: "error",
        });
      }
      // Generate a password reset token and send it to the user's email
      const token = Math.floor(Math.random() * 1000000); // Simple token generation, replace with a more secure method
      sendEmail(user.email, token);
      res.status(200).json({
        message: "Password reset email sent",
        status: "success",
      });
    })
    .catch((error) => {
      res.status(200).json({
        message: "Error sending password reset email",
        status: "error",
        error: error.message,
      });
    });
};

const dashboard = async (req, res) => {
  try {
    const token = verifyToken(req.headers.authorization);
    if (!token || !token.id) {
      return res.status(200).json({
        message: "Unauthorized",
        status: "error",
      });
    }

    const user = await User.findById(token.id);
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        status: "error",
      });
    }

    const updatedUser = {
      id: user._id,
      name: user.name,
      profilePicture: user.profilePicture
        ? convertImageToBase64(user.profilePicture, user.mimeType)
        : "", // send as base64 string for frontend use
      followers: user.followers,
      following: user.following,
      bio: user.bio || "", // Include bio if it exists
      about: user.about,
      friends: await getFriends(user._id),
    };

    res.json({
      user: updatedUser,
      status: "success",
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(200).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const token = verifyToken(req.headers.authorization);
    if (!token || !token.id) {
      return res.status(200).json({
        message: "Unauthorized",
        status: "error",
      });
    }
    const posts = await Post.find({ author: token.id })
      .sort({ createdAt: -1 }) // Sort posts by createdAt field in descending order
      .populate("author")
      .populate("comments.user", "name profilePicture mimeType")
      .populate("comments.replies.user", "name profilePicture mimeType");

    const updatedPosts = await Promise.all(
      posts.map(async (post) => ({
        ...post._doc,
        image: convertImageToBase64(post.image, post.mimeType),
        author: {
          id: post.author._id,
          name: post.author.name,
          profilePicture: post.author.profilePicture
            ? convertImageToBase64(
                post.author.profilePicture,
                post.author.mimeType
              )
            : "",
        },
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
      posts: updatedPosts,
      status: "success",
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(200).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
};

const getFriends = async (userId) => {
  try {
    const user = await User.findById(userId);
    const friends = await Promise.all(
      user.followers.map(async (friendId) => {
        const friend = await User.findById(friendId);
        return {
          id: friend._id,
          name: friend.name,
          profilePicture: await convertImageToBase64(
            friend.profilePicture,
            friend.mimeType
          ),
        };
      })
    );
    return friends;
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
};

module.exports = {
  login,
  signup,
  updateUser,
  deleteUser,
  uploadProfilePicture,
  follow,
  forgetPassword,
  dashboard,
  getAllPosts,
};
