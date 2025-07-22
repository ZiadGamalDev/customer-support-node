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

// Socket.IO CORS configuration using environment variables
const allowedOrigins = [
  process.env.ADMIN_FRONTEND_URL,
  process.env.AGENT_FRONTEND_URL,
  process.env.CHAT_FRONTEND_URL,
  process.env.ECOMMERCE_FRONTEND_URL
].filter(Boolean); // Remove any undefined values

const io = new Server(server, { 
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

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
