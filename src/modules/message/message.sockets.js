const messageSockets = (socket, io) => {
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    socket.chatId = chatId;
    socket.userId = socket.user.id;
    console.log(`User ${socket.user.name} joined chat ${chatId}`);
  });

  socket.on("sendMessage", async ({ chatId, message, receiverId }) => {
    try {
      console.log(`Sending message from ${socket.userId} to ${receiverId}:`, message);

      const clients = Array.from(io.sockets.sockets.values());
      const receiverSocket = clients.find(client => client.userId === receiverId);

      if (receiverSocket) {
        receiverSocket.emit("messageSent", { chatId, message });
      } else {
        console.warn(`Receiver ${receiverId} not found.`);
      }

      socket.emit("messageDelivered", { chatId, message });

    } catch (err) {
      console.error("Error sending message:", err);
      socket.emit("error", { message: "Failed to send message." });
    }
  });

  socket.on("startTyping", (chatId) => {
    socket.to(chatId).emit("typingStarted");
  });

  socket.on("stopTyping", (chatId) => {
    socket.to(chatId).emit("typingStopped");
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.name} disconnected (${socket.id})`);
  });
};

export default messageSockets;
