import userResponse from "../user/user.response.js";

const messageResponse = (message) => {
  return {
    id: message._id,
    chatId: message.chatId,
    sender: userResponse(message.sender),
    receiver: userResponse(message.receiver),
    message: message.message,
    status: message.status,
    createdAt: message.createdAt,
  };
};

export default messageResponse;
