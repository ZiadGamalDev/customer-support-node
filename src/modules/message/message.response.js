import userResponse from "../user/user.response.js";

const messageResponse = (message) => {
  return {
    id: message._id,
    chatId: message.chatId,
    senderId: message.senderId,
    receiverId: message.receiverId,
    sender: message.sender ? userResponse(message.sender) : null,
    receiver: message.receiver ? userResponse(message.receiver) : null,
    content: message.content,
    status: message.status,
    createdAt: message.createdAt,
  };
};

export default messageResponse;
