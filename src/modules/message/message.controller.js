import MessageService from './message.service.js';
import messageResponse from './message.response.js';

class MessageController {
    async all(req, res, next) {
        try {
            const messages = await MessageService.all(req.params.chatId);
            
            res.status(200).json(messages.map(messageResponse));
        } catch (err) {
            next(err);
        }
    }

    async send(req, res, next) {
        try {
            const message = await MessageService.send(req.user.id, req.body.receiver, req.body.message);

            res.status(201).json(messageResponse(message));
        } catch (err) {
            next(err);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const message = await MessageService.updateStatus(req.params.messageId, req.params.status);
            
            res.status(200).json(messageResponse(message));
        } catch (err) {
            next(err);
        }
    }
}

export default new MessageController();
