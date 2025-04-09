import ChatService from "../chat/chat.service.js";
import MessageService from "./message.service.js";
import NotificationService from "../notification/notification.service.js";

const messageSockets = (socket, io) => {
  console.log("New socket connection", { socketId: socket.id });

  socket.on("joinChat", async ({ chatId, userType }) => {
    try {
      if (!chatId || !userType) {
        throw new Error("Missing required parameters");
      }

      const userId = await ChatService.findChatUserIdByRole(chatId, userType);
      console.log("userId from chatId", userId);

      socket.join(chatId);
      socket.chatId = chatId.toString();
      socket.userId = userId.toString();

      // Store user type to know if this is agent or customer
      socket.userType = userType;

      console.log("User joined chat", {
        event: "joinChat",
        socketId: socket.id,
        chatId,
        userId,
        userType,
      });
    } catch (err) {
      console.error("Join chat error", {
        event: "joinChat",
        error: err.message,
        socketId: socket.id,
      });
      socket.emit("error", { message: "Failed to join chat" });
    }
  });

  socket.on("sendMessage", async ({ chatId, message: content }) => {
    try {
      if (!chatId || !content) {
        throw new Error("Missing required message parameters");
      }

      if (!socket.userId) {
        throw new Error("User not authenticated");
      }

      console.log("Message sending attempt", {
        event: "sendMessage",
        chatId,
        senderId: socket.userId,
        content,
      });

      const message = await MessageService.create(
        chatId,
        socket.userId,
        content
      );
      console.log("message createddd", message);

      const chat = await ChatService.findById(chatId);

      console.log("chat before create message noti", chat);

      // Create notification
      const notification = await NotificationService.createMessageNotification(
        message,
        chat
      );

      // Find receiver's sockets and emit notifications
      const receiverSockets = [...io.sockets.sockets.values()].filter(
        (s) => s.userId === message.receiverId.toString()
      );

      receiverSockets.forEach((receiverSocket) => {
        receiverSocket.emit("notification", notification);
      });

      // Emit message to chat room
      socket.to(chatId).emit("messageReceived", { message });

      // Emit messageDelivered event to sender
      socket.emit("messageDelivered", { message });

      console.log("Message saved and delivered", {
        messageId: message._id,
        chatId,
        senderId: socket.userId,
      });
    } catch (err) {
      console.error("Message error", {
        event: "sendMessage",
        error: err.message,
        chatId,
        senderId: socket.userId,
      });
      socket.emit("error", {
        message: "Failed to send message",
        error: err.message,
      });
    }
  });


  socket.on("disconnect", () => {
    console.log("User disconnected", {
      event: "disconnect",
      socketId: socket.id,
      userId: socket.userId,
      chatId: socket.chatId,
    });
  });
};

export default messageSockets;
