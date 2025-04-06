import Message from "../../database/models/message.model.js";
import Chat from "../../database/models/chat.model.js";
import { roles } from "../../database/enums/user.enum.js";
import { statuses } from "../../database/enums/chat.enum.js";

class MessageService {
  async all(chatId) {
    return await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .lean();
  }

  async create(chatId, senderId, content) {
    try {
      const chat = await Chat.findById(chatId);
      const senderRole = chat.agentId.equals(senderId) ? roles.AGENT : roles.CUSTOMER;
      const receiverId = senderRole == roles.AGENT ? chat.customerId : chat.agentId;
      const message = await Message.create({ chatId, senderId, receiverId, content, senderRole });

      chat.lastMessageId = message._id;
      if (senderRole == roles.AGENT) {
        chat.agentUnreadCount = (chat.agentUnreadCount || 0) + 1;

        if (this.isFirstReply(chat)) {
          await this.handleFirstReply(chat);
        }
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

  async isFirstReply(chat) {
    return chat.status == statuses.OPEN
  }

  async handleFirstReply(chat) {
    chat.status = statuses.IN_PROGRESS
    await chat.save();
  }
}

export default new MessageService();
