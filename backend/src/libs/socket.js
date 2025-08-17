import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
import dotenv from "dotenv";
dotenv.config();

const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_ORIGIN , "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

console.log("Socket.IO server initialized with CORS settings", {
  origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
});

const userSocketMap = {};

export const getUserSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("A new User connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
