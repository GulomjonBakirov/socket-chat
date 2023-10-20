import { Socket, Server } from "socket.io";
import { sendError } from "./error.handler";
import { User } from "../models";

const onlineStatus = async (io: Server, socket: Socket, user_id: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      {
        _id: user_id,
      },
      {
        $set: {
          is_online: true,
          socket_id: socket.id,
        },
      }
    );

    socket.broadcast.emit("online", { user: user._id });
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

const offlineStatus = async (io: Server, socket: Socket, user_id: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      {
        _id: user_id,
      },
      {
        $set: {
          is_online: false,
        },
      }
    );

    socket.broadcast.emit("offline", { user: user._id });
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

export { onlineStatus, offlineStatus };
