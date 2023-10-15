// For Handling Errors
// socket.broadcast.emit("error", {error: true, status: code, timestampt: ...., message: errorMessage})

import { Server } from "socket.io";
import getUserInfo from "./helper/get-user-info.js";
import User from "./model/user.model.js";
import Chat from "./model/chat.model.js";
import authSocketMid from "./middleware/auth-socket.middleware.js";
import Group from "./model/group.model.js";

export default function (server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // For development purpose
      methods: ["POST", "GET"],
    },
  });

  io.use(authSocketMid).on("connection", async (socket, next) => {
    const user = socket.user;
    user.socket_id = socket.id;

    try {
      await User.findByIdAndUpdate(
        {
          _id: user.user_id,
        },
        {
          $set: {
            is_online: true,
            socket_id: socket.id,
          },
        }
      );
    } catch (err) {
      console.log("Error: ", err);
      next(new Error("Server Error by updating"));
    }

    socket.broadcast.emit("get-online-user", { user_id: user.user_id });

    // Send Message
    socket.on("send message", async ({ to, message }) => {
      console.log("Received Data: ", data);

      const receiver = await User.findById({ _id: data.to });

      console.log("Receiver: ", receiver);
      console.log("Sender: ", user.user_id);

      const chat = new Chat({
        to: data.to,
        from: user.user_id,
        message: data.message,
        timestamp: new Date(),
      });

      await chat.save();

      io.to(receiver.socket_id).emit("received message", {
        from: user.user_id,
        message: data.message,
      });
    });

    // Load Chats
    socket.on("exists-chat", async (data) => {
      const chats = await Chat.find({
        $or: [
          { from: data.to, to: user.user_id },
          { from: user.user_id, to: data.to },
        ],
      });

      socket.emit("load-messages", { chats, length: chats.length });
    });

    // Create Room
    socket.on("create room", async ({ name, limit }) => {
      const group = new Group({
        name: name,
        limit: limit,
        creator_id: user.user_id,
        members: [
          {
            user_id: user.user_id,
            member_type: "CREATOR",
          },
        ],
      });

      await group.save();

      socket.join(group.id);

      io.sockets.to(group.id).emit("room message", {
        message: "You are in the room",
        group_id: group._id,
      });
    });

    // Join Room
    socket.on("join room", async ({ room_id }) => {
      const group = await Group.findByIdAndUpdate(
        {
          _id: room_id,
        },
        {
          $push: {
            members: {
              user_id: user.user_id,
              member_type: "USER",
            },
          },
        },
        { new: true }
      );

      if (!group) {
        return next(new Error("Group is invalid"));
      }

      console.log("Rooms: ", io.sockets.adapter.rooms);

      socket.join(group.id);

      io.sockets.to(group.id).emit("room message", {
        user: user,
        message: `${user.name} is joined`,
      });
    });

    // Leave Room
    socket.on("leave room", async ({ room_id }) => {
      const group = await Group.findByIdAndUpdate(
        {
          _id: room_id,
        },
        {
          $pull: {
            members: {
              user_id: user.user_id,
            },
          },
        },
        { new: true }
      );

      socket.leave(group.id);

      io.sockets.to(group.id).emit("room message", {
        user: user,
        message: `${user.name} is leaved`,
      });
    });

    // Get Online Users On Room
    socket.on("get online users", async ({ room }) => {});

    // Get All Users of Room
    socket.on("get all users", async ({ room_id }) => {
      const { members } = await Group.findById({
        _id: room_id,
      });

      console.log("Members: ", members, user);

      io.sockets.to(user.socket_id).emit("room message", {
        members,
      });
    });

    // Disconnect user
    socket.on("disconnect", async () => {
      User.findByIdAndUpdate(
        {
          _id: user.user_id,
        },
        {
          $set: {
            is_online: false,
          },
        }
      ).catch((err) => {
        console.log("Error: ", err);
        next(new Error("Server Error by updating"));
      });

      socket.broadcast.emit("get-offline-user", { user_id: user.user_id });
    });
  });
}
