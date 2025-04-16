import Message from "../../database/models/message.model.js";
import Chat from "../../database/models/chat.model.js";
import { roles } from "../../database/enums/user.enum.js";
import { _findNewAgent, _notifyChatCreated } from "../../services/helpers.js";
import ChatService from "../chat/chat.service.js";

class MessageService {
  async all(chatId) {
    return await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .lean();
  }

  async assignUnassignedMessages(chatId, agentId) {
    return await Message.updateMany(
      { chatId, receiverId: null },
      { $set: { receiverId: agentId } },
      { new: true }
    )
      .sort({ createdAt: 1 })
      .lean();
  }

  async isFirstMessage(chat) {
    return !(await Message.exists({ chatId: chat._id }));
  }

  async create(chatId, senderId, content) {
    try {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        throw new Error("Chat not found");
      } else if (await ChatService.isChatReadyToOpen(chat)) {
        console.log("Chat is ready to open:", chat._id, chat.status);
        await _findNewAgent(chat);
        await _notifyChatCreated(chat);
      } else if (await this.isFirstMessage(chat)) {
        await _notifyChatCreated(chat);
      }

      const senderRole = chat.customerId.equals(senderId)
        ? roles.CUSTOMER
        : roles.AGENT;
      const receiverId =
        senderRole == roles.AGENT ? chat.customerId : chat.agentId;
      const message = await Message.create({
        chatId,
        senderId,
        receiverId,
        content,
        senderRole,
      });

      console.log("message creation", message);

      chat.lastMessageId = message._id;
      if (senderRole == roles.AGENT) {
        chat.agentUnreadCount = (chat.agentUnreadCount || 0) + 1;
      } else {
        chat.customerUnreadCount = (chat.customerUnreadCount || 0) + 1;
      }
      await chat.save();
      return message;
    } catch (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  async updateStatus(messageId, status) {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    )
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .lean();
    return updatedMessage;
  }

  async deleteByChatId(chatId) {
    return await Message.deleteMany({ chatId });
  }
}

export default new MessageService();
