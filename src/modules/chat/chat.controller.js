import ChatService from './chat.service.js';
import chatResponse from './chat.response.js';

class ChatController {
    async all(req, res) {
        try {
            const chats = await ChatService.all(req.user.id);
            res.status(200).json(chats.map(chatResponse));
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch chats' });
        }
    }

    async findOrCreate(req, res) {
        try {
            const sender = req.user.id;
            const { receiver } = req.body;

            const chat = await ChatService.findOrCreate(sender, receiver);
            res.status(200).json(chatResponse(chat));
        } catch (err) {
            res.status(400).json({ message: 'Failed to start chat' });
        }
    }

    async resetUnreadCount(req, res) {
        try {
            const updatedChat = await ChatService.resetUnreadCount(req.params.chatId, req.user.id);
            res.status(200).json(chatResponse(updatedChat));
        } catch (err) {
            res.status(400).json({ message: 'Failed to reset unread count' });
        }
    }
}

export default new ChatController();
