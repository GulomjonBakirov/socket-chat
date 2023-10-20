import { NextFunction } from "express";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { onlineStatus } from "../socket/update-user-status.handler";
import { sendError } from "../socket/error.handler";

export const authMid = (io: Server, socket: Socket, next: any) => {
  if (
    socket.handshake.headers &&
    socket.handshake.headers.authorization &&
    socket.handshake.headers.authorization.split(" ")[1]
  ) {
    const access_token = socket.handshake.headers.authorization.split(" ")[1];

    // verify token
    jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET,
      (err: any, user: any) => {
        if (err) {
          sendError(
            io,
            {
              error: true,
              status: 403,
              message: "Token is not valid !",
              timestamp: new Date().toISOString(),
            },
            true,
            socket.id
          );
        }

        socket.data.user = user;

        onlineStatus(io, socket, user.id);

        next();
      }
    );
  } else {
    sendError(
      io,
      {
        error: true,
        status: 403,
        message: "Not Authorize !",
        timestamp: new Date().toISOString(),
      },
      true,
      socket.id
    );
  }
};
