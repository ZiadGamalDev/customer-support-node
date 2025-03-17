import Chat from '../../database/models/chat.model.js';

class ChatService {
    async all(userId) {
        return await Chat.find({ participants: userId })
            .populate('participants', 'id name email image')
            .populate('lastMessage');
    }

    async findOrCreate(sender, receiver) {
        let chat = await Chat.findOne({ participants: { $all: [sender, receiver] } });

        if (!chat) {
            chat = await Chat.create({ participants: [sender, receiver] });
        }

        return await chat.populate([
            { path: 'participants', select: 'id name email image' },
            { path: 'lastMessage' }
        ]);
    }

    async resetUnreadCount(userId, chatId) {
        return await Chat.findByIdAndUpdate(
            chatId, 
            { $set: { [`unreadCount.${userId}`]: 0 } }, 
            { new: true }
        ).populate('participants', 'id name email image')
         .populate('lastMessage');
    }
}

export default new ChatService();
