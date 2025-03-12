import Chat from '../../database/models/chat.model.js';
import Message from '../../database/models/message.model.js';

class ChatService {
    async all(userId) {
        return await Chat.find({ participants: userId })
            .populate('participants', 'name email image')
            .populate('lastMessage');
    }

    async findOrCreate(sender, receiver) {
        let chat = await Chat.findOne({ participants: { $all: [sender, receiver] } });

        if (!chat) {
            chat = await Chat.create({ participants: [sender, receiver] });
        }

        return chat;
    }

    async updateLastMessage(chatId, messageId) {
        return await Chat.findByIdAndUpdate(chatId, { lastMessage: messageId }, { new: true });
    }

    async resetUnreadCount(chatId, userId) {
        return await Chat.findByIdAndUpdate(chatId, { $set: { [`unreadCount.${userId}`]: 0 } }, { new: true });
    }
}

export default new ChatService();
