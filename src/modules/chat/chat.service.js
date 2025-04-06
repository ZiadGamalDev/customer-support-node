import { statuses } from "../../database/enums/chat.enum.js";
import { statuses as userStatuses } from "../../database/enums/user.enum.js";
import { roles } from "../../database/enums/user.enum.js";
import Chat from "../../database/models/chat.model.js";
import Message from "../../database/models/message.model.js";
import UserService from "../user/user.service.js";
import NotificationService from "../notification/notification.service.js";

class ChatService {
  async all(userId) {
    return Chat.find({
      agentId: userId,
      status: { $in: [statuses.OPEN, statuses.IN_PROGRESS] },
    });
  }

  async findOrCreate(customer) {
    let chat = await Chat.findOne({ customerId: customer._id });
    let agent;

    if (chat) {
      if (chat.status === statuses.RESOLVED) {
        agent = await this._reassignResolvedChat(chat, customer);
      } else {
        agent = await this._notifyExistingAgent(chat, customer);
      }
    } else {
      ({ chat, agent } = await this._createNewChat(customer));
    }

    const lastMessage = await Message.findById(chat.lastMessageId);
    return { ...chat.toObject(), customer, agent, lastMessage };
  }

  async _reassignResolvedChat(chat, customer) {
    const agent = await UserService.findAvailableAgent();
    await this.reAssignAgent(chat, agent);
    await this._notifyAgent(agent._id, chat, customer, "resumed");
    return agent;
  }

  async _notifyExistingAgent(chat, customer) {
    const agent = await UserService.findById(chat.agentId);
    await this._notifyAgent(agent._id, chat, customer, "reassigned");
    return agent;
  }

  async _createNewChat(customer) {
    const agent = await UserService.findAvailableAgent();
    const chat = await Chat.create({
      customerId: customer._id,
      agentId: agent._id,
      title: `Chat with ${customer.username || "Customer"}`,
    });

    await this.assignAgent(chat, agent);
    await this._notifyAgent(agent._id, chat, customer, "new");

    return { chat, agent };
  }

  async _notifyAgent(agentId, chat, customer, type) {
    const notification = await NotificationService.createChatNotification(
      { ...chat.toObject(), customer },
      type
    );
    this.emitNotificationToAgent(agentId, notification);
  }

  emitNotificationToAgent(agentId, notification) {
    try {
      const io = global.io;
      if (!io) return;

      const agentSockets = [...io.sockets.sockets.values()].filter(
        (socket) => socket.userId === agentId.toString()
      );

      agentSockets.forEach((socket) => {
        socket.emit("notification", notification);
      });
    } catch (error) {
      console.error("Failed to emit notification to agent:", error);
    }
  }

  async resetUnreadCount(userId, chatId, role) {
    const update =
      role === roles.AGENT
        ? { agentUnreadCount: 0 }
        : { customerUnreadCount: 0 };

    const condition =
      role === roles.AGENT
        ? { _id: chatId, agentId: userId }
        : { _id: chatId };

    return Chat.findOneAndUpdate(condition, update, { new: true });
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

    if (status === statuses.RESOLVED) {
      await this.handleResolvedChat(chat);
    }

    return chat;
  }

  async handleResolvedChat(chat) {
    const agent = await UserService.findById(chat.agentId);
    if (!agent) throw new Error("Agent not found");

    agent.status = userStatuses.ONLINE;
    agent.chatsCount = Math.max(0, (agent.chatsCount || 1) - 1);
    await agent.save();
  }

  async awayAgent(chat, agent) {
    chat.agentId = null;
    chat.status = statuses.PENDING;
    await chat.save();

    if (agent) {
      agent.status = statuses.AWAY;
      await agent.save();
    }
  }

  async assignAgent(chat, agent) {
    chat.status = statuses.OPEN;
    await chat.save();
    await this.updateAgent(agent);
  }

  async reAssignAgent(chat, agent) {
    chat.agentId = agent._id;
    chat.status = statuses.IN_PROGRESS;
    await chat.save();
    await this.updateAgent(agent);
  }

  async updateAgent(agent) {
    agent.status = userStatuses.BUSY;
    agent.chatsCount = (agent.chatsCount || 0) + 1;
    await agent.save();
  }
}

export default new ChatService();
