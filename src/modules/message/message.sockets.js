import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const messageSockets = (socket, io) => {
  socket.on("joinChat", async (chatId, userId, userType) => {
    socket.join(chatId);
    socket.chatId = chatId;
    socket.userId = userId;

    let userApiUrl = userType === "agent"
      ? `${process.env.CLIENT_BASE_URL}/users/${userId}`
      : `${process.env.APP_BASE_URL}/users/${userId}`;

    try {
      const response = await axios.get(userApiUrl);
      socket.user = response.data;
      console.log(`User ${socket.user.name} joined chat ${chatId}`);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  });

  socket.on("sendMessage", async ({ chatId, message, receiverId }) => {
    try {
      console.log(`Sending message from ${socket.userId} to ${receiverId}:`, message);

      const receiverSocket = [...io.sockets.sockets.values()].find(client => client.userId === receiverId);

      if (receiverSocket) {
        receiverSocket.emit("messageSent", { chatId, message });
        console.log(`Message sent to ${receiverId}`);
      } else {
        console.log(`Receiver ${receiverId} not found.`);
      }

      socket.emit("messageDelivered", { chatId, message });
    } catch (err) {
      console.error("Error sending message:", err);
      socket.emit("error", { message: "Failed to send message." });
    }
  });

  socket.on("startTyping", ({ chatId, receiverId }) => {
    const receiverSocket = [...io.sockets.sockets.values()].find(client => client.userId === receiverId);
    if (receiverSocket) {
      receiverSocket.emit("typingStarted", { chatId });
      console.log(`Typing indicator sent to ${receiverId}`);
    }
  });

  socket.on("stopTyping", ({ chatId, receiverId }) => {
    const receiverSocket = [...io.sockets.sockets.values()].find(client => client.userId === receiverId);
    if (receiverSocket) {
      receiverSocket.emit("typingStopped", { chatId });
      console.log(`Typing indicator stopped for ${receiverId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected (${socket.id})`);
  });
};

export default messageSockets;
