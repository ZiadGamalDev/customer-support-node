import { statuses } from "../../database/enums/chat.enum.js";
import { roles } from "../../database/enums/user.enum.js";
import Chat from "../../database/models/chat.model.js";
import Message from "../../database/models/message.model.js";
import updateStatus from "../../services/status.js";
import {
  _assignChatToAgent,
  _findExistingAgent,
  _findNewAgent,
  _notifyAgent,
} from "../../services/helpers.js";
import ChatNotificationHandler from "./chat.notification.js";

class ChatService {
  async agentChats(agentId) {
    return Chat.find({ agentId, status: statuses.OPEN });
  }

  async findById(chatId) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");
    return chat;
  }

  async findPendingChat() {
    return await Chat.findOne({ status: statuses.PENDING }).sort({
      createdAt: 1,
    });
  }

  async findChatUserIdByRole(chatId, role) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");
    return role === roles.AGENT ? chat.agentId : chat.customerId;
  }

  async findOrCreate(customer) {
    let chat = await Chat.findOne({ customerId: customer._id });
    let agent;
    let notificationType = "new";

    if (chat) {
      if (chat.status === statuses.RESOLVED) {
        agent = await _findNewAgent(chat);
        notificationType = "resumed";
      } else if (chat.status == statuses.PENDING) {
        agent = await _findNewAgent(chat);
        notificationType = "new";
      } else {
        agent = await _findExistingAgent(chat);
        return { ...chat.toObject(), customer, agent };
      }
    } else {
      chat = await Chat.create({
        customerId: customer._id,
        title: `Chat with ${customer.username}`,
      });
      agent = await _findNewAgent(chat);
      notificationType = "new";
    }

    // Notify agent after assignment
    await ChatNotificationHandler.notifyAgentChatAssigned(
      chat,
      customer,
      notificationType
    );

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
