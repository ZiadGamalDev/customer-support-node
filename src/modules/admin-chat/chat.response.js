import customerResponse from "../customer/customer.response.js";
import messageResponse from "../message/message.response.js";
import userResponse from "../user/user.response.js";

const chatResponse = (chat) => {
  return {
    id: chat._id,
    title: chat.title,
    description: chat.description,
    status: chat.status,
    priority: chat.priority,
    customerUnreadCount: chat.customerUnreadCount,
    agentUnreadCount: chat.agentUnreadCount,
    createdAt: chat.createdAt,
    lastMessage: chat.lastMessage ? messageResponse(chat.lastMessage) : chat.lastMessageId,
    customer: chat.customer ? customerResponse(chat.customer) : chat.customerId,
    agent: chat.agent ? userResponse(chat.agent) : chat.agentId,
  };
};

export default chatResponse;
