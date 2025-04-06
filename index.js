import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/database/connection.js";
import resourceSockets from "./src/resource/sockets.js";
import { Server } from "socket.io";
import authenticateSocket from "./src/middleware/authenticate.socket.js";
import NotificationScheduler from "./src/utils/notification.schedule.js";

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
  resourceSockets(socket, io);
  // Authenticate user and set socket.userId
  socket.on("authenticate", (data) => {
    const userId = data.userId;
    socket.userId = userId;
  });
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
