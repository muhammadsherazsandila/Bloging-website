import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/token.js";
import { sendEmail } from "../utils/resetPass.js";
import sharp from "sharp";
import { convertImageToBase64, formatDate } from "../utils/formaters.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        status: "error",
      });
    }
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
      profilePicture: pngBuffer?.toString("base64"),
      followers: user.followers.length,
      following: user.following.length,
      bio: user.bio || "",
    };
    res.status(200).json({
      message: "Login successful",
      status: "success",
      user: updatedUser,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(200).json({
      message: "Error logging in",
      status: "error",
      error: error.message,
    });
  }
};

export const signup = async (req, res) => {
  if (!req.body) {
    return res.status(200).json({
      message: "having no body",
    });
  }
  const { name, email, password } = req.body;
  const pass = bcrypt.hashSync(password, 10);
  const newUser = new User({ name, email, password: pass });
  try {
    const user = await newUser.save();
    let pngBuffer = null;
    if (user.profilePicture) {
      pngBuffer = await sharp(user.profilePicture).png().toBuffer();
    }
    const updatedUser = {
      name: user.name,
      profilePicture: pngBuffer?.toString("base64"),
      followers: user.followers.length,
      following: user.following.length,
      bio: user.bio || "",
    };
    res.status(200).json({
      message: "User created successfully",
      status: "success",
      user: updatedUser,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(200).json({
      message: "User Already Exist!",
      status: "error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      verifyToken(req.headers.authorization).id,
      req.body,
      { new: true }
    );
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
      profilePicture: pngBuffer?.toString("base64"),
      followers: user.followers.length,
      following: user.following.length,
      bio: user.bio || "",
    };
    if (req.body.password) {
      updatedUser.password = req.body.password;
    }
    res.status(200).json({
      message: "User updated successfully",
      status: "success",
      user: updatedUser,
    });
  } catch (error) {
    res.status(200).json({
      message: "Error updating user",
      status: "error",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(verifyToken(req.headers.authorization).id);
    res.status(200).json({
      message: "User deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(200).json({
      message: "Error deleting user",
      status: "error",
      error: error.message,
    });
  }
};

export const uploadProfilePicture = async (req, res) => {
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
      profilePicture: convertImageToBase64(user.profilePicture, user.mimeType),
      followers: user.followers.length,
      following: user.following.length,
      bio: user.bio || "",
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

export const follow = async (req, res) => {
  const authorId = req.params.id;
  const { userId, followed } = req.body;

  try {
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(200).json({
        message: "Author not found",
        status: "error",
      });
    }

    const update = followed
      ? { $addToSet: { followers: userId } }
      : { $pull: { followers: userId } };

    await User.findByIdAndUpdate(authorId, update);

    const follower = await User.findById(userId);
    if (!follower) {
      return res.status(200).json({
        message: "Follower not found",
        status: "error",
      });
    }

    const following = followed
      ? { $addToSet: { following: authorId } }
      : { $pull: { following: authorId } };

    await User.findByIdAndUpdate(userId, following);

    res.status(200).json({
      message: "User followed successfully",
      status: "success",
    });
  } catch (error) {
    res.status(200).json({
      message: "Error following user",
      status: "error",
      error: error.message,
    });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        status: "error",
      });
    }
    const token = Math.floor(Math.random() * 1000000);
    sendEmail(user.email, token);
    res.status(200).json({
      message: "Password reset email sent",
      status: "success",
    });
  } catch (error) {
    res.status(200).json({
      message: "Error sending password reset email",
      status: "error",
      error: error.message,
    });
  }
};

export const dashboard = async (req, res) => {
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
        : "",
      followers: user.followers,
      following: user.following,
      bio: user.bio || "",
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

export const getAllPosts = async (req, res) => {
  try {
    let id = "";
    if (req.params.id.length > 24) {
      id = verifyToken(req.params.id).id;
    } else {
      id = req.params.id;
    }
    const user = await User.findById(id).populate({
      path: "posts",
      populate: [
        {
          path: "author",
          select: "name profilePicture mimeType",
        },
        {
          path: "comments.user",
          select: "name profilePicture mimeType",
        },
        {
          path: "comments.replies.user",
          select: "name profilePicture mimeType",
        },
      ],
    });

    if (!user) {
      return res.status(200).json({
        message: "User not found",
        status: "error",
      });
    }
    const formattedPosts = await Promise.all(
      user.posts.map(async (post) => ({
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
        createdDate: post.createdAt,
      }))
    );

    const updatedUser = {
      id: user._id,
      name: user.name,
      profilePicture: user.profilePicture
        ? convertImageToBase64(user.profilePicture, user.mimeType)
        : "",
      followers: user.followers,
      following: user.following,
      bio: user.bio || "",
      about: user.about,
      friends: await getFriends(user._id),
      posts: formattedPosts,
    };

    if (updatedUser) {
      res.json({
        user: updatedUser,
        status: "success",
      });
    } else {
      res.status(200).json({
        message: "User not found",
        status: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(200).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
};

export const getFriends = async (userId) => {
  try {
    const user = await User.findById(userId);
    const friends = await Promise.all(
      user.followers.map(async (friendId) => {
        const friend = await User.findById(friendId);
        return {
          id: friend._id,
          name: friend.name,
          profilePicture: friend.profilePicture
            ? convertImageToBase64(friend.profilePicture, friend.mimeType)
            : "",
        };
      })
    );
    return friends;
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
};
