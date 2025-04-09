import Notification from "../../database/models/notification.model.js";
import Chat from "../../database/models/chat.model.js";
import { roles } from "../../database/enums/user.enum.js";
import mongoose from "mongoose";

class NotificationService {
  async createMessageNotification(message, chat) {
    try {
      const role = message.senderId.equals(chat.agentId)
        ? roles.AGENT
        : roles.CUSTOMER;

      const preview =
        message.content.substring(0, 50) +
        (message.content.length > 50 ? "..." : "");

      const notification = await Notification.create({
        userId: message.receiverId,
        type: "message",
        title: `New message from ${
          role === roles.AGENT ? "Agent" : "Customer"
        }`,
        content: preview,
        read: false,
        reference: {
          model: "Message",
          id: message._id,
        },
        metadata: {
          chatId: chat._id,
          senderRole: role,
        },
      });

      if (role === roles.AGENT) {
        await Chat.findByIdAndUpdate(chat._id, {
          $inc: { customerUnreadCount: 1 },
        });
      } else {
        await Chat.findByIdAndUpdate(chat._id, {
          $inc: { agentUnreadCount: 1 },
        });
      }

      return notification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  //  method to create chat notifications when a customer starts or resumes a chat
  async createChatNotification(chat, type = "new") {
    try {
      const title =
        type === "new" ? "New customer chat" : "Customer resumed chat";
      const content =
        type === "new"
          ? `A new customer needs assistance`
          : `Customer has resumed a previously resolved chat`;

      const notification = await Notification.create({
        userId: chat.agentId,
        type: "chat_assignment",
        title,
        content,
        read: false,
        reference: {
          model: "Chat",
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
          type: "system",
          title,
          content,
          read: false,
          reference: {
            model: "User",
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
  async emitUserNotifications(userId) {
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

      const { notifications, pagination } = await this.getUserNotifications(
        userId
      );
      const unreadCount = await this.getUnreadCount(userId);

      const userSockets = [...io.sockets.sockets.values()].filter(
        (socket) => socket.userId === userId.toString()
      );

      console.log(`Found ${userSockets.length} sockets for user ${userId}`);

      const payload = {
        notifications,
        pagination,
        unreadCount,
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
}

export default new NotificationService();
