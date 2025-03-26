import messageResponse from "../message/message.response.js";

const chatResponse = (chat) => {
  return {
    id: chat._id,
    customerId: chat.customerId,
    agent: chat.agentId,
    lastMessage: chat.lastMessage ? messageResponse(chat.lastMessage) : null,
    unreadCount: chat.unreadCount,
    createdAt: chat.createdAt,
  };
};

export default chatResponse;
