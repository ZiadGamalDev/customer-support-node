import { chatStatusesByAgent, chatStatusesBySystem } from "../database/enums/chat.enum.js";
import { userStatusesByAgent, userStatusesBySystem } from "../database/enums/user.enum.js";
import ChatService from "../modules/chat/chat.service.js";
import notificationService from "../modules/notification/notification.service.js";
import UserService from "../modules/user/user.service.js";

/**************************  ***************************/

export async function _handleAwayAgent(agent) {
  console.log("_handleAwayAgent/agent:", agent._id);
  agent.status = userStatusesByAgent.AWAY;
  agent.chatsCount = 0;
  await agent.save();

  const chats = await ChatService.agentChats(agent._id);
  for (const chat of chats) {
    await _makeChatNew(chat);
    await _findNewAgent(chat);
  }
}

export async function _handleAvailableAgent(agent) {
  console.log("_handleAvailableAgent/agent:", agent._id);
  await _makeAgentAvailable(agent);
}

export async function _handlePendingChat(chat) {
  console.log("_handlePendingChat/chat:", chat._id);
  const agent = await _findExistingAgent(chat);
  if (agent) await _makeAgentAvailable(agent)
  chat.agentId = null;
  chat.status = chatStatusesByAgent.PENDING;
  await chat.save();
}

export async function _handleResolvedChat(chat) {
  console.log("_handleResolvedChat/chat:", chat._id);
  const agent = await _findExistingAgent(chat);
  if (agent) await _makeAgentAvailable(agent)
  chat.agentId = null;
  chat.status = chatStatusesByAgent.RESOLVED;
  await chat.save();
}

/**************************  ***************************/

export async function _makeChatNew(chat) {
  console.log("_makeChatNew/chat:", chat._id);
  chat.agentId = null;
  chat.status = chatStatusesBySystem.NEW;
  await chat.save();
}

export async function _makeAgentAvailable(agent) {
  console.log("_makeAgentAvailable/agent:", agent._id);
  agent.status = userStatusesByAgent.AVAILABLE;
  agent.chatsCount = 0;
  await agent.save();
  const chat = await ChatService.findPendingChat()
  if (chat) await _assignChatToAgent(chat, agent);
}

/**************************  ***************************/

export async function _findNewAgent(chat) {
  console.log("_findNewAgent/chat:", chat._id)
  const availableAgent = await UserService.findAvailableAgent();
  if (availableAgent) {
    await _assignChatToAgent(chat, availableAgent);
  }
  return availableAgent;
}

export async function _findExistingAgent(chat) {
  console.log("_findExistingAgent/chat:", chat._id);
  const agent = await UserService.findById(chat.agentId);
  await _notifyAgent(chat, "reassigned");
  return agent;
}

/**************************  ***************************/

export async function _assignChatToAgent(chat, agent) {
  console.log("_assignChatToAgent/chat:", chat._id);
  console.log("_assignChatToAgent/agent:", agent._id);
  chat.agentId = agent._id;
  chat.status = chatStatusesBySystem.OPEN;
  await chat.save();
  agent.status = userStatusesBySystem.BUSY;
  agent.chatsCount = (agent.chatsCount || 0) + 1;
  await agent.save();
  _notifyAgent(chat, "reassigned");
}

/**************************  ***************************/

export async function _notifyAgent(chat, type) {
  const notification = await notificationService.createChatNotification(chat, type);
  _emitNotificationToAgent(chat.agentId, notification);
}

export async function _emitNotificationToAgent(agentId, notification) {
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
