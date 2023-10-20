import mongoose, { Schema, model } from "mongoose";
import { IChat } from "../types";

const chatSchema = new Schema<IChat>(
  {
    to: { type: mongoose.Schema.ObjectId, ref: "Users" },
    from: { type: mongoose.Schema.ObjectId, ref: "Users" },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "Chats",
  }
);

export const Chat = model<IChat>("Chats", chatSchema);
