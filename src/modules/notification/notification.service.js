import Notification from "../../database/models/notification.model.js";
import Chat from "../../database/models/chat.model.js";
import { roles } from "../../database/enums/user.enum.js";
import { types, models } from "../../database/enums/notification.enum.js";
import mongoose from "mongoose";

class NotificationService {
  async createMessageNotification(message, chat) {
    try {
      const role = message.senderRole;
      const preview = message.content.substring(0, 50) + (message.content.length > 50 ? "..." : "");

      const notification = await Notification.create({
        userId: message.receiverId,
        type: types.MESSAGE,
        title: `New message from ${role}`,
        content: preview,
        read: false,
        reference: {
          model: models.MESSAGE,
          id: message._id,
        },
        metadata: {
          chatId: chat._id,
          senderRole: role,
        },
      });

      if (role === roles.AGENT) {
        await Chat.findByIdAndUpdate(chat._id, { $inc: { customerUnreadCount: 1 } });
      } else {
        await Chat.findByIdAndUpdate(chat._id, { $inc: { agentUnreadCount: 1 } });
      }

      return notification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  //  method to create chat notifications when a customer starts or resumes a chat
  async createChatNotification(chat, type = "new") {
    try {
      const title = type === "new" ? "New customer chat" : "Customer resumed chat";
      const content = type === "new"
        ? `A new customer needs assistance`
        : `Customer has resumed a previously resolved chat`;

      const notification = await Notification.create({
        userId: chat.agentId,
        type: types.CHAT_ASSIGNMENT,
        title,
        content,
        read: false,
        reference: {
          model: models.CHAT,
          id: chat._id,
        },
        metadata: {
          chatId: chat._id,
          chatStatus: chat.status,
          customerName: chat.customer?.name || "Customer",
        },
      });

      return notification;
    } catch (error) {
      throw new Error(`Failed to create chat notification: ${error.message}`);
    }
  }

  async getUserNotifications(userId, options = {}) {
    try {
      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
      }

      const {
        limit = 20,
        offset = 0,
        read,
        sort = { createdAt: -1 },
      } = options;

      // Create a new ObjectId instance
      const query = { userId: new mongoose.Types.ObjectId(userId) };
      if (read !== undefined) {
        query.read = read;
      }

      const notifications = await Notification.find(query)
        .sort(sort)
        .skip(offset)
        .limit(limit);

      const total = await Notification.countDocuments(query);

      return {
        notifications,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + notifications.length < total,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  }

  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({ userId, read: false });
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      return await Notification.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(notificationId),
          userId: new mongoose.Types.ObjectId(userId),
        },
        { read: true },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  async markAllAsRead(userId, filter = {}) {
    try {
      const query = {
        userId: new mongoose.Types.ObjectId(userId),
        read: false,
        ...filter,
      };
      const result = await Notification.updateMany(query, { read: true });
      return result.modifiedCount;
    } catch (error) {
      throw new Error(
        `Failed to mark all notifications as read: ${error.message}`
      );
    }
  }

  async deleteNotification(notificationId, userId) {
    try {
      return await Notification.findOneAndDelete({
        _id: notificationId,
        userId,
      });
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  // For bulk operations
  async deleteOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    try {
      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        read: true,
      });
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Failed to delete old notifications: ${error.message}`);
    }
  }

  // Create system notifications
  async createSystemNotification(userIds, title, content, metadata = {}) {
    try {
      const notifications = await Notification.insertMany(
        userIds.map((userId) => ({
          userId,
          type: types.SYSTEM,
          title,
          content,
          read: false,
          reference: {
            model: models.USER,
            id: userId,
          },
          metadata,
        }))
      );

      return notifications;
    } catch (error) {
      throw new Error(
        `Failed to create system notifications: ${error.message}`
      );
    }
  }

  // Add this method to emit notifications to a specific user
  async emitUserNotifications(userId, options = {}) {
    try {
      const io = global.io;
      if (!io) {
        console.log("Socket.IO instance not found");
        return;
      }

      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
      }

      // Pass options to getUserNotifications
      const { notifications, pagination } = await this.getUserNotifications(
        userId,
        options
      );
      const unreadCount = await this.getUnreadCount(userId);

      const userSockets = [...io.sockets.sockets.values()].filter(
        (socket) => socket.userId === userId.toString()
      );

      console.log(`Found ${userSockets.length} sockets for user ${userId}`);
      console.log('Emitting with options:', options);

      const payload = {
        notifications,
        pagination,
        unreadCount,
        options // Include options in payload for client reference
      };

      userSockets.forEach((socket) => {
        socket.emit("userNotifications", payload);
        console.log(`Emitted notifications to socket ${socket.id}`);
      });
    } catch (error) {
      console.error("Failed to emit user notifications:", error);
      throw error;
    }
  }

  // Method to create status change notifications
  async createStatusChangeNotification(userId, chatId, status, metadata = {}) {
    try {
      const notification = await Notification.create({
        userId,
        type: types.STATUS_CHANGE,
        title: `Chat status updated`,
        content: `Chat status changed to: ${status}`,
        read: false,
        reference: {
          model: models.CHAT,
          id: chatId,
        },
        metadata: {
          chatId,
          status,
          ...metadata
        },
      });

      return notification;
    } catch (error) {
      throw new Error(`Failed to create status change notification: ${error.message}`);
    }
  }
}

export default new NotificationService();