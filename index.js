import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/database/connection.js";
import resourceSockets from "./src/resource/sockets.js";
import { Server } from "socket.io";
import authenticateSocket from "./src/middleware/authenticate.socket.js";
import NotificationScheduler from "./src/utils/notification.schedule.js";
import NotificationService from "./src/modules/notification/notification.service.js";
import mongoose from "mongoose";

dotenv.config();
connectDB();
NotificationScheduler.init();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const server = app.listen(PORT, () =>
  console.log(`Server running at ${BASE_URL}`)
);
const io = new Server(server, { cors: "*" });

global.io = io;
// io.use(authenticateSocket);
io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("authenticate", async (data) => {
    try {
      const userId = data.userId;

      // Validate userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
      }

      socket.userId = userId;
      console.log(`Socket ${socket.id} authenticated for user ${userId}`);

      await NotificationService.emitUserNotifications(userId);
    } catch (error) {
      console.error("Authentication error:", error);
      socket.emit("error", {
        message: "Authentication failed",
        details: error.message,
      });
    }
  });

  resourceSockets(socket, io);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  // Cancel scheduled jobs
  NotificationScheduler.cancelAll();
  // Close server connections
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
