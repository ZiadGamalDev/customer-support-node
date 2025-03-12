import Message from '../../database/models/message.model.js';
import Chat from '../../database/models/chat.model.js';

class MessageService {
  async all(chatId) {
    return await Message.find({ chatId }).sort({ createdAt: 1 });
  }

  async send(sender, receiver, message) {
    let chat = await Chat.findOne({ participants: { $all: [sender, receiver] } });

    if (!chat) {
      chat = await Chat.create({ participants: [sender, receiver] });
    }

    const newMessage = await Message.create({ chatId: chat._id, sender, receiver, message });

    chat.lastMessage = newMessage._id;
    chat.unreadCount.set(receiver, (chat.unreadCount.get(receiver) || 0) + 1);
    await chat.save();

    return newMessage;
  }

  async updateStatus(messageId, status) {
    return await Message.findByIdAndUpdate(messageId, { status }, { new: true });
  }
}

export default new MessageService();
