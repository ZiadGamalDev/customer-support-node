import { statuses } from "../../database/enums/chat.enum.js";
import { statuses as userStatuses } from "../../database/enums/user.enum.js";
import { roles } from "../../database/enums/user.enum.js";
import Chat from "../../database/models/chat.model.js";
import Message from "../../database/models/message.model.js";
import UserService from "../user/user.service.js";
import NotificationService from "../notification/notification.service.js";

class ChatService {
  async all(userId) {
    return await Chat.find({
      agentId: userId,
      status: { $in: [statuses.OPEN, statuses.IN_PROGRESS] },
    });
  }

  async findOrCreate(customer) {
    let chat = await Chat.findOne({ customerId: customer._id });
    let agent;
    let isNewChat = false;

    if (chat) {
      if (chat.status === statuses.RESOLVED) {
        // If chat was previously resolved, find available agent and reassign
        agent = await UserService.findAvailableAgent();
        this.reAssignAgent(chat, agent);

        // Notify about resumed chat
        const notification = await NotificationService.createChatNotification(
          { ...chat.toObject(), customer },
          "resumed"
        );
        this.emitNotificationToAgent(agent._id, notification);
      } else {
        // Chat is not resolved, check if previous agent is available
        const previousAgent = await UserService.findById(chat.agentId);

        if (previousAgent && previousAgent.status === userStatuses.ONLINE) {
          // Previous agent is available, reassign chat to them
          agent = previousAgent;
          this.reAssignAgent(chat, agent);

          // Notify about reassignment to same agent
          const notification = await NotificationService.createChatNotification(
            { ...chat.toObject(), customer },
            "reassigned"
          );
          this.emitNotificationToAgent(agent._id, notification);
        } else {
          // Previous agent is not available, find new available agent
          agent = await UserService.findAvailableAgent();
          this.reAssignAgent(chat, agent);

          // Notify about reassignment to new agent
          const notification = await NotificationService.createChatNotification(
            { ...chat.toObject(), customer },
            "reassigned"
          );
          this.emitNotificationToAgent(agent._id, notification);
        }
      }
    } else {
      // Create new chat with available agent
      isNewChat = true;
      agent = await UserService.findAvailableAgent();
      chat = await Chat.create({
        customerId: customer._id,
        agentId: agent._id,
        title: `Chat with ${customer.name || "Customer"}`,
      });

      await this.assignAgent(chat, agent);

      // Notify about new chat
      const notification = await NotificationService.createChatNotification(
        { ...chat.toObject(), customer },
        "new"
      );
      this.emitNotificationToAgent(agent._id, notification);
    }

    const lastMessage = await Message.findById(chat.lastMessageId);
    return { ...chat.toObject(), customer, agent, lastMessage };
  }

  //  method to emit notifications to agents through sockets
  emitNotificationToAgent(agentId, notification) {
    try {
      // Get socket.io instance from the global scope
      const io = global.io;
      if (!io) return;

      // Find all socket connections for this agent
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
    return role === roles.AGENT
      ? await Chat.findOneAndUpdate(
          { _id: chatId, agentId: userId },
          { agentUnreadCount: 0 },
          { new: true }
        )
      : await Chat.findOneAndUpdate(
          { _id: chatId },
          { customerUnreadCount: 0 },
          { new: true }
        );
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
    agent.chatsCount = (agent.chatsCount || 1) - 1;
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
    await this.updateAgentAndChat(chat, agent);
  } //first assignment for chat

  async reAssignAgent(chat, agent) {
    chat.agentId = agent._id;
    chat.status = statuses.IN_PROGRESS;
    await this.updateAgentAndChat(chat, agent);
  } // resume chat or agent is busy

  async updateAgentAndChat(chat, agent) {
    await chat.save();
    agent.status = userStatuses.BUSY;
    agent.chatsCount = (agent.chatsCount || 0) + 1;
    await agent.save();
  }
}

export default new ChatService();
