import ChatService from './chat.service.js';
import chatResponse from './chat.response.js';

class ChatController {
    async all(req, res, next) {
        try {
            const chats = await ChatService.all(req.user.id);

            res.status(200).json(chats.map(chatResponse));
        } catch (err) {
            next(err);
        }
    }

    async findOrCreate(req, res, next) {
        try {
            const chat = await ChatService.findOrCreate(req.user.id, req.body.receiver);

            res.status(200).json(chatResponse(chat));
        } catch (err) {
            next(err);
        }
    }

    async resetUnreadCount(req, res, next) {
        try {
            const chat = await ChatService.resetUnreadCount(req.user.id, req.params.chatId);

            res.status(200).json(chatResponse(chat));
        } catch (err) {
            next(err);
        }
    }
}

export default new ChatController();
