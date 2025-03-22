import Message from '../../database/models/message.model.js';
import ChatService from '../chat/chat.service.js';

class MessageService {
  async all(chatId) {
    return await Message.find({ chatId }).sort({ createdAt: 1 });
  }

  async send(sender, receiver, text) {
    const chat = await ChatService.findOrCreate(sender, receiver);
    const message = await Message.create({ chatId: chat._id, userId: sender, message: text });

    chat.lastMessage = message._id;
    chat.unreadCount.set(receiver, (chat.unreadCount.get(receiver) || 0) + 1);
    await chat.save();

    io.to(chat._id.toString()).emit("message:received", message);

    return message;
  }

  async updateStatus(messageId, status) {
    const message = await Message.findByIdAndUpdate(messageId, { status }, { new: true });

    io.to(message.chatId.toString()).emit("message:seen", { messageId, status });

    return message;
  }
}

export default new MessageService();
