import MessageService from "./message.service.js";
import { statuses } from "../../database/enums/message.enum.js";
import chatService from "../chat/chat.service.js";

const messageSockets = (socket, io) => {
  console.log("🔌 New socket connection:", {
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });

  // Handle join chat events
  socket.on("joinChat", async (chatId, userType) => {
    try {
      if (!chatId || !userType) {
        throw new Error("Missing required parameters");
      }

      const userId = chatService.findUserIdByType(chatId, userType);

      socket.join(chatId);
      socket.chatId = chatId;
      socket.userId = userId;

      console.log("👋 User joined chat:", {
        event: "joinChat",
        socketId: socket.id,
        chatId,
        userId,
        userType,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Join chat error:", {
        event: "joinChat",
        error: err.message,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
      socket.emit("error", { message: "Failed to join chat" });
    }
  });

  // Handle send message events
  socket.on("sendMessage", async ({ chatId, message: content }) => {
    try {
      if (!chatId || !content) {
        throw new Error("Missing required message parameters");
      }

      if (!socket.userId) {
        throw new Error("User not authenticated");
      }

      console.log("📝 Message sending attempt:", {
        event: "sendMessage",
        chatId,
        senderId: socket.userId,
        content: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
        timestamp: new Date().toISOString(),
      });

      const message = await MessageService.create({
        chatId,
        senderId: socket.userId,
        content,
      });

      console.log("✅ Message saved:", {
        messageId: message._id,
        chatId,
        senderId: socket.userId,
      });

      // Emit to chat room
      socket.to(chatId).emit("messageReceived", { message });
      console.log("📨 Message emitted to room:", { chatId });

      // Confirm delivery to sender
      socket.emit("messageDelivered", { message });
      console.log("📫 Delivery confirmed to sender:", { socketId: socket.id });
    } catch (err) {
      console.error("❌ Message error:", {
        event: "sendMessage",
        error: err.message,
        chatId,
        senderId: socket.userId,
        timestamp: new Date().toISOString(),
      });
      socket.emit("error", {
        message: "Failed to send message",
        error: err.message,
      });
    }
  });

  // Handle message read events
  socket.on("messageRead", async ({ messageId }) => {
    try {
      if (!messageId) {
        throw new Error("Missing message ID");
      }

      if (!socket.userId) {
        throw new Error("User not authenticated");
      }

      console.log("👀 Message read event:", {
        event: "messageRead",
        messageId,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });

      const message = await MessageService.updateStatus(
        messageId,
        statuses.READ
      );

      if (!message) {
        throw new Error("Message not found");
      }

      io.to(message.chatId.toString()).emit("messageStatusUpdated", {
        messageId,
        status: statuses.READ,
      });

      console.log("✓ Message status updated:", {
        messageId,
        status: statuses.READ,
        chatId: message.chatId,
      });
    } catch (err) {
      console.error("❌ Status update error:", {
        event: "messageRead",
        error: err.message,
        messageId,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
      socket.emit("error", {
        message: "Failed to update message status",
        error: err.message,
      });
    }
  });

  // Handle typing events
  socket.on("startTyping", async ({ chatId, userType }) => {
    try {
      if (!chatId || !userType) {
        throw new Error("Missing required typing parameters");
      }

      // Derive receiverId from chatId and userType
      const receiverId = await chatService.findUserIdByType(chatId, userType);
      if (!receiverId) {
        throw new Error("Receiver not found for the given chatId and userType");
      }

      console.log("⌨️ Typing started:", {
        event: "startTyping",
        chatId,
        userId: socket.userId,
        receiverId,
      });

      const receiverSocket = [...io.sockets.sockets.values()].find(
        (client) => client.userId === receiverId
      );

      if (receiverSocket) {
        receiverSocket.emit("typingStarted", { chatId });
        console.log("📝 Typing indicator sent:", { receiverId });
      } else {
        console.log("⚠️ Receiver not found:", { receiverId });
      }
    } catch (err) {
      console.error("❌ Typing indicator error:", {
        event: "startTyping",
        error: err.message,
        chatId,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    }
  });

  socket.on("stopTyping", async ({ chatId, userType }) => {
    try {
      if (!chatId || !userType) {
        throw new Error("Missing required typing parameters");
      }

      // Derive receiverId from chatId and userType
      const receiverId = await chatService.findUserIdByType(chatId, userType);
      if (!receiverId) {
        throw new Error("Receiver not found for the given chatId and userType");
      }

      console.log("⌨️ Typing stopped:", {
        event: "stopTyping",
        chatId,
        userId: socket.userId,
        receiverId,
      });

      const receiverSocket = [...io.sockets.sockets.values()].find(
        (client) => client.userId === receiverId
      );

      if (receiverSocket) {
        receiverSocket.emit("typingStopped", { chatId });
        console.log("✋ Typing stop sent:", { receiverId });
      } else {
        console.log("⚠️ Receiver not found:", { receiverId });
      }
    } catch (err) {
      console.error("❌ Typing stop error:", {
        event: "stopTyping",
        error: err.message,
        chatId,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle disconnect events
  socket.on("disconnect", () => {
    try {
      console.log("👋 User disconnected:", {
        event: "disconnect",
        socketId: socket.id,
        userId: socket.userId,
        chatId: socket.chatId,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Disconnect error:", {
        event: "disconnect",
        error: err.message,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
    }
  });
};

export default messageSockets;
