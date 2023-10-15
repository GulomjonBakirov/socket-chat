import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_online: {
      type: Boolean,
      default: false,
    },
    socket_id: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "User",
  }
);

export default mongoose.model("User", userSchema);
