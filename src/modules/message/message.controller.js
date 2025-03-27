import { roles } from "../../database/enums/user.enum.js";
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

  async customerSend(req, res, next) {
    try {
      const message = await MessageService.create(req.body.chatId, req.customer._id, req.body.content);
      
      res.status(201).json(messageResponse(message));
    } catch (err) {
      next(err);
    }
  }

  async agentSend(req, res, next) {
    try {
      const message = await MessageService.create(req.body.chatId, req.user._id, req.body.content);
      
      res.status(201).json(messageResponse(message));
    } catch (err) {
      next(err);
    }
  }

  async customerUpdateStatus(req, res, next) {
    try {
      const message = await MessageService.updateStatus(req.params.messageId, req.params.status);

      res.status(200).json(messageResponse(message));
    } catch (err) {
      next(err);
    }
  }

  async agentUpdateStatus(req, res, next) {
    try {
      const message = await MessageService.updateStatus(req.params.messageId, req.params.status);

      res.status(200).json(messageResponse(message));
    } catch (err) {
      next(err);
    }
  }
}

export default new MessageController();
