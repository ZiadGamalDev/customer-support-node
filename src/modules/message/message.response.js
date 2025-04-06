const messageResponse = (message) => {
  return {
    id: message._id,
    chatId: message.chatId,
    senderId: message.senderId,
    receiverId: message.receiverId,
    content: message.content,
    status: message.status,
    senderRole: message.senderRole,
    createdAt: message.createdAt,
  };
};

export default messageResponse;
