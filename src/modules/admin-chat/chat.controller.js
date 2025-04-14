import ChatService from "./chat.service.js";
import chatResponse from "./chat.response.js";

class ChatController {
  async all(req, res, next) {
    try {
      const chats = await ChatService.all();

      res.status(200).json(chats.map(chat => chatResponse(chat)));
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const chat = await ChatService.findById(req.params.chatId);

      res.status(200).json(chatResponse(chat));
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const chat = await ChatService.update(req.params.chatId, req.body);

      res.status(200).json(chatResponse(chat));
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      ChatService.delete(req.params.chatId);

      res.status(200).json({ message: "Chat deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default new ChatController();
