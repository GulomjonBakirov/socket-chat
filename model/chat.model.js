import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "Chats",
  }
);

export default mongoose.model("Chat", chatSchema);
