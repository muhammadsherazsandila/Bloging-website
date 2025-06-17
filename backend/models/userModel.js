import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    token: {
      type: String,
      required: false,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
      required: false,
    },
    profilePicturePublicId: {
      type: String,
      default: "",
      required: false,
    },
    mimeType: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
      maxlength: 100,
    },
    about: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
