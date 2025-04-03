import { Router } from "express";
import NotificationController from "./notification.controller.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";


const notificationRoutes = Router();

// Get user's notifications
notificationRoutes.get(
  "/",
  authenticate(),
  NotificationController.getUserNotifications
);

// Get unread count
notificationRoutes.get(
  "/unread",
  authenticate(),
  NotificationController.getUnreadCount
);

// Mark single notification as read
notificationRoutes.put(
  "/:notificationId/read",
  authenticate(),
  
  NotificationController.markAsRead
);

// Mark all notifications as read
notificationRoutes.put(
  "/read-all",
  authenticate(),
  NotificationController.markAllAsRead
);

// Delete a notification
notificationRoutes.delete(
  "/:notificationId",
  authenticate(),

  NotificationController.deleteNotification
);

export default notificationRoutes;
