import { Server } from "socket.io";

export const sendMessage = async (
  io: Server,
  data: any,
  specific: boolean,
  receiver?: string
) => {
  if (specific) {
    io.to(receiver).emit("message", {
      data,
    });
  } else {
    io.emit("message", {
      data,
    });
  }
};
