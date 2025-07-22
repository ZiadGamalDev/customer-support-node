import ChatService from "../modules/chat/chat.service.js";
import MessageService from "../modules/message/message.service.js";
import NotificationService from "../modules/notification/notification.service.js";

const resourceSockets = (socket, io) => {
  console.log("New socket connection:", socket.id);

  socket.on("joinNotification", async (agentId) => {
    try {
      // Use the authenticated user ID if no agentId provided
      const targetAgentId = agentId || socket.user._id.toString();
      
      if (!targetAgentId) {
        throw new Error("Agent ID is required");
      }

      socket.join(targetAgentId);

      console.log("Agent joined notification room", { agentId: targetAgentId });
    } catch (err) {
      console.error("Join notification error", { error: err.message });
      socket.emit("error", { message: "Failed to join notification room" });
    }
  });

  socket.on("joinChat", async ({ chatId, userType }) => {
    try {
      if (!chatId || !userType) {
        throw new Error("Missing required parameters");
      }

      const userId = await ChatService.findChatUserIdByRole(chatId, userType);

      socket.join(chatId);
      socket.chatId = chatId.toString();
      socket.userId = userId.toString();
      socket.userType = userType;

      console.log("User joined chat", { chatId, userId, userType });
    } catch (err) {
      console.error("Join chat error", { error: err.message });
      socket.emit("error", { message: "Failed to join chat" });
    }
  });

  socket.on("sendMessage", async ({ chatId, message: content }) => {
    try {
      if (!chatId || !content) {
        throw new Error("Missing required message parameters");
      } else if (!socket.userId) {
        throw new Error("User not authenticated");
      }

      const chat = await ChatService.findById(chatId);
      console.log("Chat retrieved", chat._id);

      const message = await MessageService.create(
        chatId,
        socket.userId,
        content
      );
      console.log("Message created", message._id);

      socket.emit("messageDelivered", { message });
      console.log("Message delivered to sender", message._id);

      if (chat.agentId) {
        socket.to(chatId).emit("messageReceived", { message });
        console.log("Message sent to receiver", chatId, message._id);

        const notification = 
          await NotificationService.createMessageNotification(message, chat);
        console.log("Notification created", notification._id);
      }
    } catch (err) {
      console.error("Message error", { error: err.message, chatId });
      socket.emit("error", {
        message: "Failed to send message",
        error: err.message,
      });
    }
  });

  socket.on("disconnect", () =>
    console.log("User disconnected with id:", socket.id)
  );
};

export default resourceSockets;
