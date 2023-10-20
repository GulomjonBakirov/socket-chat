import { Server, Socket } from "socket.io";

import chatHandler from "./chat.handler";
import { authMid } from "../middleware";

export default function (server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const onConnection = (socket: Socket) => {
    chatHandler(io, socket);
  };

  io.use((socket: Socket, next) => authMid(io, socket, next)).on(
    "connect",
    onConnection
  );
}
