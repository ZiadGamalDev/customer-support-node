import ChatService from "../modules/chat/chat.service.js";
import MessageService from "../modules/message/message.service.js";
import NotificationService from "../modules/notification/notification.service.js";

const resourceSockets = (socket, io) => {
  console.log("New socket connection:", socket.id);

  socket.on("joinNotification", async (agentId) => {
    try {
      if (!agentId) {
        throw new Error("Agent ID is required");
      }

      socket.join(agentId.toString());

      console.log("Agent joined notification room", { agentId });
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
      console.log("Chat retrieved", chat);

      if (! chat) {
        throw new Error("Chat not found");
      } 
      
      if (await MessageService.isFirstMessage(chat) || await ChatService.isChatConsideredNew(chat)) {
        const agentId = chat.agentId?.toString();
        socket.to(agentId).emit("chatCreated", { chatId });
        console.log("Chat created and sent to agent room", { chatId, agentId });
      }

      const message = await MessageService.create(chatId, socket.userId, content);
      console.log("Message created", message);

      socket.to(chatId).emit("messageReceived", { message });
      console.log("Message sent to receiver", { chatId, message });

      socket.emit("messageDelivered", { message });
      console.log("Message delivered to sender", { message });

      const notification = await NotificationService.createMessageNotification(message, chat);
      console.log("Notification created", notification);
    } catch (err) {
      console.error("Message error", { error: err.message, chatId});
      socket.emit("error", { message: "Failed to send message", error: err.message });
    }
  });

  socket.on("disconnect", () =>
    console.log("User disconnected with id:", socket.id)
  );
};

export default resourceSockets;
