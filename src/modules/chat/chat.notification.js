import NotificationService from "../notification/notification.service.js";

class ChatNotificationHandler {
  async notifyAgentChatAssigned(chat, customer, type = "new") {
    try {
      // Create notification
      const notification = await NotificationService.createChatNotification(
        { ...chat.toObject(), customer },
        type
      );

      // Emit to agent's sockets
      const io = global.io;
      if (!io) {
        console.log("Socket.IO instance not found");
        return;
      }

      const agentSockets = [...io.sockets.sockets.values()].filter(
        (socket) => socket.userId === chat.agentId.toString()
      );

      const payload = {
        type: "chat_assigned",
        chatId: chat._id,
        notification,
        chat: { ...chat.toObject(), customer },
      };

      console.log(
        `Found ${agentSockets.length} sockets for agent ${chat.agentId}`
      );

      agentSockets.forEach((socket) => {
        socket.emit("chatAssigned", payload);
        console.log(
          `Emitted chat assignment to agent ${chat.agentId} on socket ${socket.id}`
        );
      });
    } catch (error) {
      console.error("Failed to notify agent of chat assignment:", error);
      throw error;
    }
  }
}

export default new ChatNotificationHandler();
