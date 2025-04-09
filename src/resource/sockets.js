import messageSockets from "../modules/message/message.sockets.js";
import notificationSockets from "../modules/notification/notification.sockets.js";

const resourceSockets = (socket, io) => {
  console.log("User connected with id:", socket.id);

  messageSockets(socket, io);
  notificationSockets(socket, io);

  socket.on("disconnect", () =>
    console.log("User disconnected with id:", socket.id)
  );
};

export default resourceSockets;
