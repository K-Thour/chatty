import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import Friend from "../models/friends.model.js"; // import your friends model

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      process.env.CORS_ORIGIN,
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Keep track of connected users
const userSocketMap = {}; // { userId: socketId }

export const getUserSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;

    // 🔹 Fetch user's friends (accepted only)
    const friends = await Friend.find({
      $or: [
        { userId, status: "accepted" },
        { friendId: userId, status: "accepted" },
      ],
    });

    const friendIds = friends.map((f) =>
      f.userId.toString() === userId ? f.friendId.toString() : f.userId.toString()
    );
    // 🔹 Determine which friends are online
    // Send the list of online friends to the connected user
    // Store all online users in an array
    // const onlineFriends = Object.keys(userSocketMap).filter((uid) => onlineFriends.includes(uid));
    const onlineUsers = Object.keys(userSocketMap);
    const onlineFriends = friendIds.filter((id) => onlineUsers.includes(id));

    // Send only this user's online friends
    io.to(socket.id).emit("getOnlineUsers", [...onlineFriends,userId]);
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];

      // After disconnect, update friends again
      io.emit("userDisconnected", userId);
    }
  });
});

export { io, app, server };
