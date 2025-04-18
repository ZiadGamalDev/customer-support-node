import { statuses } from "../../database/enums/chat.enum.js";
import { roles } from "../../database/enums/user.enum.js";
import Chat from "../../database/models/chat.model.js";
import Message from "../../database/models/message.model.js";
import updateStatus from "../../services/status.js";
import {
  _assignChatToAgent,
  _findExistingAgent,
  _findNewAgent,
  _logStatus,
  _notifyAgent,
} from "../../services/helpers.js";


class ChatService {
  async agentChats(agentId) {
    return Chat.find({ agentId, status: statuses.OPEN });
  }

  async findById(chatId) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");
    return chat;
  }

  async findChatReadyToOpen() {
    return await Chat.findOne({ status: { $in: [statuses.NEW, statuses.PENDING] } }).sort({
      createdAt: 1,
    });
  }

  async isChatReadyToOpen(chat) {
    return await chat.status == statuses.NEW || chat.status == statuses.PENDING || chat.status == statuses.RESOLVED;
  }

  async findChatUserIdByRole(chatId, role) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");
    return role === roles.AGENT ? chat.agentId : chat.customerId;
  }

  async findOrCreate(customer, data) {
    let chat = await Chat.findOne({ customerId: customer._id });
    let agent;

    if (chat) {
      Object.assign(chat, data);
      await chat.save();
      if (await this.isChatReadyToOpen(chat)) {
        agent = await _findNewAgent(chat);
      } else {
        agent = await _findExistingAgent(chat);
      }
    } else {
      chat = await Chat.create({
        customerId: customer._id,
        title: data.title ?? `Chat with ${customer.username}`,
        description: data.description ?? "No description provided",
      });
      await _logStatus(chat, statuses.NEW);
      agent = await _findNewAgent(chat);
    }

    const lastMessage = await Message.findById(chat.lastMessageId);
    return { ...chat.toObject(), customer, agent, lastMessage };
  }

  async updateStatus(userId, chatId, status) {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new Error("Chat not found");
    } else if (chat.agentId != userId) {
      throw new Error("You are not authorized to update this chat");
    }

    await updateStatus.chat(chat, status);

    return chat;
  }

  async resetUnreadCount(userId, chatId, role) {
    const update =
      role === roles.AGENT
        ? { agentUnreadCount: 0 }
        : { customerUnreadCount: 0 };

    const condition =
      role === roles.AGENT ? { _id: chatId, agentId: userId } : { _id: chatId };

    return Chat.findOneAndUpdate(condition, update, { new: true });
  }
}

export default new ChatService();
