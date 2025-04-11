import ChatService from "./chat.service.js";
import chatResponse from "./chat.response.js";
import { roles } from "../../database/enums/user.enum.js";

class ChatController {
  async all(req, res, next) {
    try {
      const chats = await ChatService.agentChats(req.user.id);

      res.status(200).json(chats.map(chat => chatResponse(chat)));
    } catch (err) {
      next(err);
    }
  }

  async findOrCreate(req, res, next) {
    try {
      const chat = await ChatService.findOrCreate(req.customer);

      res.status(200).json(chatResponse(chat));
    } catch (err) {
      next(err);
    }
  }

  async agentResetUnreadCount(req, res, next) {
    try {
      const chat = await ChatService.resetUnreadCount(req.user.id, req.params.chatId, roles.AGENT);

      res.status(200).json(chatResponse(chat));
    } catch (err) {
      next(err);
    }
  }

  async customerResetUnreadCount(req, res, next) {
    try {
      const chat = await ChatService.resetUnreadCount(req.customer.id, req.params.chatId, roles.CUSTOMER);

      res.status(200).json(chatResponse(chat));
    } catch (err) {
      next(err);
    }
  }

  async agentUpdateStatus(req, res, next) {
    try {
      const chat = await ChatService.updateStatus(req.user.id, req.params.chatId, req.params.status);

      res.status(200).json(chatResponse(chat));
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
}

export default new ChatController();
