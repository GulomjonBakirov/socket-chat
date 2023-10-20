import mongoose from "mongoose";

export declare interface IChat {
  to: typeof mongoose.Schema.ObjectId;
  from: typeof mongoose.Schema.ObjectId;
  message: string;
}
