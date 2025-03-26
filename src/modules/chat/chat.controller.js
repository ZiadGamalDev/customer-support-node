import ChatService from "./chat.service.js";
import chatResponse from "./chat.response.js";
import UserService from "../user/user.service.js"; // Add this import

class ChatController {
  async all(req, res, next) {
    try {
      const chats = await ChatService.all(req.user.id);

      res.status(200).json(chats.map(chatResponse));
    } catch (err) {
      next(err);
    }
  }

  async findOrCreate(req, res, next) {
    try {
      // Get all available agents
      const agents = await UserService.findByRole("agent");
       
      if (!agents.length) {
        return res.status(404).json({
          message: "No agents available",
        });
      }

      // Select random agent
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];

      const chat = await ChatService.findOrCreate(
        req.customerId,
        randomAgent._id
      );

      res.status(200).json(chatResponse(chat));
    } catch (err) {
      next(err);
    }
  }

  async resetUnreadCount(req, res, next) {
    try {
      const chat = await ChatService.resetUnreadCount(
        req.user.id,
        req.params.chatId
      );

      res.status(200).json(chatResponse(chat));
    } catch (err) {
      next(err);
    }
  }
}

export default new ChatController();
