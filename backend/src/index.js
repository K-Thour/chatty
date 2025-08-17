import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import database from "./libs/database/index.js";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./libs/swagger/swagger.js";
import cors from "cors";
import { app, server } from "./libs/socket.js";

dotenv.config();

const port = process.env.PORT || 3000;
const baseUrl = "api/v1";
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
console.log("CORS is enabled", process.env.CORS_ORIGIN);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);
app.use(`/${baseUrl}/auth`, routes.authRoutes);
app.use(`/${baseUrl}/user`, routes.userRoutes);
app.use(`/${baseUrl}/chat`, routes.chatRoutes);

server.listen(port, async () => {
  await database.connectDB();
  console.log(`Server is running on port ${port}`);
});
