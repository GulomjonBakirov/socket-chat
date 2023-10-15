import mongoose, { mongo } from "mongoose";

const members = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  member_type: {
    type: String,
    enum: ["ADMIN", "USER", "CREATOR"],
    default: "USER",
  },
});

const groupSchema = new mongoose.Schema(
  {
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      default: 10,
    },

    members: [members],

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "Groups",
  }
);

export default mongoose.model("Group", groupSchema);
