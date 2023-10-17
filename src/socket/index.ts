import { Server, Socket } from "socket.io";

import userHandler from "./user.handler";
import { NextFunction } from "express";

export default function (server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const onConnection = (socket: Socket) => {
    userHandler(io, socket);

    // io.use((socket: Socket, next) => {
    //   console.log(socket.handshake);
    //   next();
    // });
  };

  io.on("connect", onConnection);
}
