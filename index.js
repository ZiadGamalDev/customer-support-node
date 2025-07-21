import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/database/connection.js";
import resourceSockets from "./src/resource/sockets.js";
import { Server } from "socket.io";
import authenticateSocket from "./src/middleware/authenticate.socket.js";
import NotificationScheduler from "./src/utils/notification.schedule.js";
import { setSocketIO } from "./src/utils/socket.js";

dotenv.config();
connectDB();
NotificationScheduler.init();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const server = app.listen(PORT, HOST, () =>
  console.log(`Server running at ${BASE_URL}`)
);
const io = new Server(server, { cors: "*" });

global.io = io;
// io.use(authenticateSocket);
io.on("connection", (socket) => { resourceSockets(socket, io) });
setSocketIO(io);

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
