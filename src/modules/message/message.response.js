const messageResponse = (message) => {
  return {
    id: message._id,
    chatId: message.chatId,
    senderId: message.senderId,
    receiverId: message.receiverId,
    content: message.content,
    status: message.status,
    createdAt: message.createdAt,
  };
};

export default messageResponse;
