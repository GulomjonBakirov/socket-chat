import { Schema, model } from "mongoose";
import { IUser } from "../types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    is_online: { type: Boolean, default: false },
    socket_id: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

export const User = model<IUser>("Users", userSchema);
