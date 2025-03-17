import ChatService from './chat.service.js';
import chatResponse from './chat.response.js';
import logger from '../../utils/logger.js';

class ChatController {
    async all(req, res) {
        try {
            const chats = await ChatService.all(req.user.id);

            res.status(200).json(chats.map(chatResponse));
        } catch (err) {
            logger.error(err);
            res.status(500).json({ message: 'Failed to fetch chats' });
        }
    }

    async findOrCreate(req, res) {
        try {
            const chat = await ChatService.findOrCreate(req.user.id, req.body.receiver);

            res.status(200).json(chatResponse(chat));
        } catch (err) {
            logger.error(err);
            res.status(400).json({ message: 'Failed to start chat' });
        }
    }

    async resetUnreadCount(req, res) {
        try {
            const chat = await ChatService.resetUnreadCount(req.user.id, req.params.chatId);

            res.status(200).json(chatResponse(chat));
        } catch (err) {
            logger.error(err);
            res.status(400).json({ message: 'Failed to reset unread count' });
        }
    }
}

export default new ChatController();
