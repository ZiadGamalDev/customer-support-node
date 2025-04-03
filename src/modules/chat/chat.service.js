import { roles } from "../../database/enums/user.enum.js";
import Chat from "../../database/models/chat.model.js";
import Message from "../../database/models/message.model.js";
import UserService from "../user/user.service.js";

class ChatService {
  async all(userId) {
    return await Chat.find({ agentId: userId });
  }

  async findOrCreate(customer) {
    let chat = await Chat.findOne({ customerId: customer._id });
    let agent;

    if (chat) {
      agent = await UserService.findById(chat.agentId);
    } else {
      agent = await UserService.findAvailableAgent();

      chat = await Chat.create({ customerId: customer._id, agentId: agent._id });
    }

    const lastMessage = await Message.findById(chat.lastMessageId);

    return { ...chat.toObject(), customer, agent, lastMessage };
  }

  async resetUnreadCount(userId, chatId, role) {
    return role === roles.AGENT
      ? await Chat.findOneAndUpdate({ _id: chatId, agentId: userId }, { agentUnreadCount: 0 }, { new: true })
      : await Chat.findOneAndUpdate({ _id: chatId }, { customerUnreadCount: 0 }, { new: true });
  }

  async findChatUserIdByRole(chatId, role) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    return role === roles.AGENT ? chat.agentId : chat.customerId;
  }

  async updateStatus(userId, chatId, status, role) {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, [`${role}Id`]: userId },
      { status },
      { new: true }
    );

    if (!chat) {
      throw new Error(
        `Chat not found or insufficient permissions. Ensure chat ID ${chatId} exists and user ${userId} has the correct role (${role}).`
      );
    }

    return chat;
  }
}

export default new ChatService();
