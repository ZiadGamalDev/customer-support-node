import messageResponse from "./message.response.js";
import MessageService from "./message.service.js";

class MessageController {
  async all(req, res, next) {
    try {
      const messages = await MessageService.all(req.params.chatId);
      res.status(200).json(messages.map(message => messageResponse(message)));
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const message = await MessageService.create({
        chatId: req.body.chatId,
        senderId: req.user.id,
        content: req.body.content,
      });
      
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const message = await MessageService.updateStatus(
        req.params.messageId,
        req.params.status
      );
      res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  }
}

export default new MessageController();
