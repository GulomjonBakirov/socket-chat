import { Server } from "socket.io";

export const sendError = async (
  io: Server,
  data: any,
  specific: boolean,
  receiver?: string
) => {
  if (specific) {
    io.to(receiver).emit("error", {
      data,
    });
  } else {
    io.emit("error", {
      data,
    });
  }
};
