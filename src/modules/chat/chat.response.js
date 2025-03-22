import messageResponse from "../message/message.response.js";
import userResponse from "../user/user.response.js";

const chatResponse = (chat) => {
  return {
      id: chat._id,
      participants: chat.participants.map((user) => (userResponse(user))),
      lastMessage: chat.lastMessage ? messageResponse(chat.lastMessage) : null,
      unreadCount: chat.unreadCount,
      createdAt: chat.createdAt,
  };
};

export default chatResponse;
