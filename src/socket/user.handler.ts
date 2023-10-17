import bcrypt from "bcrypt";
import { NextFunction } from "express";
import { Socket, Server } from "socket.io";

import { IUser } from "../types";
import { User } from "../models";
import { sendMessage } from "./send-message.handler";
import { sendError } from "./error.handler";

export default async (io: Server, socket: Socket) => {
  const register = async (payload: IUser) => {
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = new User({
      is_online: false,
      name: payload.name,
      socket_id: socket.id,
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
    });

    try {
      await user.save();

      sendMessage(
        io,
        { user, message: "User Registrated!", status: 200 },
        true,
        user.socket_id
      );
    } catch (error) {
      sendError(
        io,
        {
          error: true,
          message: "Server Error!",
          timestamp: new Date().toISOString(),
        },
        true,
        socket.id
      );
    }
  };

  const login = async (payload: any) => {
    const user = await User.findOne({
      email: payload.email,
    });

    if (!user) {
      sendError(
        io,
        {
          error: true,
          message: "Invalid Credentials!",
          timestamp: new Date().toISOString(),
        },
        true,
        socket.id
      );
    }
  };

  // Define a middleware function for Socket.IO
  socket.on("user:registration", register);
};
