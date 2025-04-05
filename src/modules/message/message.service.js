import Message from "../../database/models/message.model.js";
import Chat from "../../database/models/chat.model.js";
import { roles } from "../../database/enums/user.enum.js";
import { statuses } from "../../database/enums/chat.enum.js";
import User from "../../database/models/user.model.js";

class MessageService {
  async all(chatId) {
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).lean();

    const userIds = new Set();
    messages.forEach(msg => {
      userIds.add(msg.senderId.toString());
      userIds.add(msg.receiverId.toString());
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }, 'name email').lean();
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    return messages.map(msg => ({
      ...msg,
      sender: userMap[msg.senderId.toString()] || null,
      receiver: userMap[msg.receiverId.toString()] || null,
    }));
  }

  async create(chatId, senderId, content) {
    try {
      const chat = await Chat.findById(chatId);
      const role = chat.agentId.equals(senderId) ? roles.AGENT : roles.CUSTOMER;
      const receiverId = role == roles.AGENT ? chat.customerId : chat.agentId;
      const message = await Message.create({ chatId, senderId, receiverId, content });

      chat.lastMessageId = message._id;
      if (role == roles.AGENT) {
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
