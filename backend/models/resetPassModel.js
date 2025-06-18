import mongoose from "mongoose";

const resetPassSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
    trim: true,
  },
  expireAt: {
    type: Date,
    required: true,
    default: Date.now, // optional but useful
  },
});

// Automatically delete document 1 hour after createdAt
resetPassSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 });

export default mongoose.model("ResetPass", resetPassSchema);
export { resetPassSchema };
