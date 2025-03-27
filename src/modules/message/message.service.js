import Message from "../../database/models/message.model.js";
import Chat from "../../database/models/chat.model.js";
import { roles } from "../../database/enums/user.enum.js";

class MessageService {
  async all(chatId) {
    return await Message.find({ chatId }).sort({ createdAt: 1 });
  }

  async create(chatId, senderId, content) {
    try {
      const chat = await Chat.findById(chatId);
      const role = chat.agentId == senderId ? roles.AGENT : roles.CUSTOMER;
      const receiverId = role == roles.AGENT ? chat.customerId : chat.agentId;
      const message = await Message.create({ chatId, senderId, receiverId, content });

      chat.lastMessageId = message._id;
      if (role == roles.AGENT) {
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
    return await Message.findByIdAndUpdate(messageId, { status }, { new: true });
  }
}

export default new MessageService();
