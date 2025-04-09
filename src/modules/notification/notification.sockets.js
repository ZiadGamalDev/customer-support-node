import mongoose from "mongoose";
import NotificationService from "./notification.service.js";

const notificationSockets = (socket, io) => {

  
  console.log(`Setting up notification sockets for user ${socket.userId}`);

  socket.on("fetchNotifications", async (options = {}) => {
    try {
      if (!socket.userId) {
        throw new Error("User not authenticated");
      }

      if (!mongoose.Types.ObjectId.isValid(socket.userId)) {
        throw new Error("Invalid user ID format");
      }

      console.log(`Fetching notifications for user ${socket.userId}`, options);
      // Pass the options to emitUserNotifications
      await NotificationService.emitUserNotifications(socket.userId, options);
    } catch (error) {
      console.error("Fetch notifications error:", error);
      socket.emit("error", {
        message: "Failed to fetch notifications",
        details: error.message,
      });
    } 1523
  });

  // Mark notification as read
  socket.on("markNotificationRead", async ({ notificationId }) => {
    try {
      if (!socket.userId) {
        throw new Error("User not authenticated");
      }

      await NotificationService.markAsRead(notificationId, socket.userId);

      // Re-emit updated notifications
      await NotificationService.emitUserNotifications(socket.userId);
    } catch (error) {
      socket.emit("error", { message: "Failed to mark notification as read" });
    }
  });

  // Mark all notifications as read
  socket.on("markAllNotificationsRead", async () => {
    try {
      if (!socket.userId) {
        throw new Error("User not authenticated");
      }

      await NotificationService.markAllAsRead(socket.userId);

      // Re-emit updated notifications
      await NotificationService.emitUserNotifications(socket.userId);
    } catch (error) {
      socket.emit("error", {
        message: "Failed to mark all notifications as read",
      });
    }
  });
};

export default notificationSockets;
