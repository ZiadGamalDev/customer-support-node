import Message from "../../database/models/message.model.js";
import Chat from "../../database/models/chat.model.js";
import { roles } from "../../database/enums/user.enum.js";
import { statuses } from "../../database/enums/chat.enum.js";
import { _findNewAgent } from "../../services/helpers.js";

class MessageService {
  async all(chatId) {
    return await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .lean();
  }

  async isFirstMessage(chat) {
    return ! await Message.exists({ chatId: chat._id });
  }

  async create(chatId, senderId, content) {
    try {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        throw new Error("Chat not found");
      } else if (chat.status == statuses.RESOLVED) {
        await _findNewAgent(chat);
      } else if (chat.status == statuses.PENDING) {
        await _findNewAgent(chat);
      } else if (await this.isFirstMessage(chat)) {
        await _notifyChatCreated(chat);
      }

      const senderRole = chat.agentId.equals(senderId)
        ? roles.AGENT
        : roles.CUSTOMER;
      const receiverId =
        senderRole == roles.AGENT ? chat.customerId : chat.agentId;
      const message = await Message.create({
        chatId,
        senderId,
        receiverId,
        content,
        senderRole,
      });

      chat.lastMessageId = message._id;
      if (senderRole == roles.AGENT) {
        chat.agentUnreadCount = (chat.agentUnreadCount || 0) + 1;
      } else {
        chat.customerUnreadCount = (chat.customerUnreadCount || 0) + 1;
      }
      await chat.save();

      return await Message.findById(message._id)
        .populate("senderId", "name email")
        .populate("receiverId", "name email")
        .lean();
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
}

export default new MessageService();
