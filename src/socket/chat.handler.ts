import { Server, Socket } from "socket.io";
import { sendMessage } from "./send-message.handler";
import { Chat, User } from "../models";
import { sendError } from "./error.handler";

export default async (io: Server, socket: Socket) => {
  const chat = async (payload: { to: string; message: string }) => {
    const receiver = await User.findById({ _id: payload.to });

    try {
      await Chat.create({
        to: payload.to,
        from: socket.data.user.id,
        message: payload.message,
      });
    } catch (error) {
      sendError(
        io,
        {
          error: true,
          status: 503,
          message: "Server Error !",
          timestamp: new Date().toISOString(),
        },
        true,
        socket.data.user.id
      );
    }

    sendMessage(
      io,
      { message: payload.message, from: socket.data.user.id },
      true,
      receiver.socket_id
    );
  };

  const get_chat = async (payload: { to: string }) => {
    const chats = await Chat.find({
      $or: [
        { from: payload.to, to: socket.data.user.id },
        { from: socket.data.user.id, to: payload.to },
      ],
    })
      .populate("to", ["name", "email", "username"])
      .populate("from", ["name", "email", "username"])
      .exec();

    sendMessage(
      io,
      { chats, length: chats.length },
      true,
      socket.data.user.socket_id
    );
  };

  socket.on("chat:message:send", chat);
  socket.on("chat:message:all", get_chat);
};
