import userResponse from "../user/user.response.js";

const messageResponse = (message) => {
  return {
    id: message._id,
    chatId: message.chatId,
    userId: message.userId,
    message: message.message,
    status: message.status,
    createdAt: message.createdAt,
  };
};

export default messageResponse;
