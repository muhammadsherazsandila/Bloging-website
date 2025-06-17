import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/token.js";
import sharp from "sharp";
import { formatDate } from "../utils/formaters.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "./mailController.js";
export const login = async (req, res) => {
  console.log(req.body);
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
    const updatedUser = {
      name: user.name,
      profilePicture: user.profilePicture,
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
    res.status(200).json({
      message: "User created successfully",
      status: "success",
      user: user,
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
    const updatedUser = {
      name: user.name,
      profilePicture: user.profilePicture,
      followers: user.followers.length,
      following: user.following.length,
      bio: user.bio || "",
    };
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
    const userId = verifyToken(req.headers.authorization).id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        status: "error",
      });
    }

    // Delete profile picture from Cloudinary if it exists
    if (user.profilePicturePublicId) {
      await cloudinary.uploader.destroy(user.profilePicturePublicId);
    }

    // Optionally: delete user's posts, comments, etc.

    //delete post of user
    await Post.deleteMany({ author: userId });
    // decrement followers and following count
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      status: "error",
      error: error.message,
    });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const token = verifyToken(req.headers.authorization);
    const user = await User.findOne({ _id: token.id });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // req.file.path is the Cloudinary image URL
    user.profilePicture = req.file.path;
    user.profilePicturePublicId = req.file.filename;
    await user.save();

    const updatedUser = {
      name: user.name,
      profilePicture: user.profilePicture, // now it's a URL
      followers: user.followers.length,
      following: user.following.length,
      bio: user.bio || "",
    };

    return res.json({
      message: "uploaded",
      user: updatedUser,
      status: "success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Upload failed",
      error: err.message,
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
  console.log(req.body);
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        status: "error",
      });
    }
    user.isPermittedToChangePassword = true;
    await user.save();
    const token = Math.floor(Math.random() * 1000000);
    sendEmail(email, token);
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

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        status: "error",
      });
    }

    if (!user.isPermittedToChangePassword) {
      return res.status(200).json({
        message: "Password reset not permitted",
        status: "error",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      message: "Password reset successfully",
      status: "success",
    });
  } catch (error) {
    res.status(200).json({
      message: "Error resetting password",
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
      profilePicture: user.profilePicture,
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

    const updatedUser = {
      id: user._id,
      name: user.name,
      profilePicture: user.profilePicture,
      followers: user.followers,
      following: user.following,
      bio: user.bio || "",
      about: user.about,
      friends: await getFriends(user._id),
      posts: user.posts.map((post) => ({
        ...post._doc,
        createdAt: formatDate(post.createdAt),
        updatedAt: formatDate(post.updatedAt),
        comments: post.comments.map((comment) => ({
          ...comment._doc,
          createdAt: formatDate(comment.createdAt),
          updatedAt: formatDate(comment.updatedAt),
          replies: comment.replies.map((reply) => ({
            ...reply._doc,
            createdAt: formatDate(reply.createdAt),
            updatedAt: formatDate(reply.updatedAt),
          })),
        })),
        createdDate: post.createdAt,
      })),
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
          profilePicture: friend.profilePicture,
        };
      })
    );
    return friends;
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
};

export const getAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await User.findById(authorId).populate("posts");
    const updatedAuthor = {
      id: author._id,
      name: author.name,
      profilePicture: author.profilePicture,
      followers: author.followers,
      following: author.following,
      bio: author.bio || "",
      about: author.about,
      friends: await getFriends(author._id),
      posts: author.posts.map((post) => ({
        ...post._doc,
        createdAt: formatDate(post.createdAt),
        updatedAt: formatDate(post.updatedAt),
      })),
    };
    res.json({
      author: updatedAuthor,
      status: "success",
    });
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(200).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
};

// javac --module-path "D:/javafx/lib" --add-modules javafx.controls -d ./bin src\Main.java
// javac --module-path "D:/javafx/lib" --add-modules javafx.controls -d ./bin src\Employee.java

// java --module-path "D:/javafx/lib" --add-modules javafx.controls -cp bin Main
