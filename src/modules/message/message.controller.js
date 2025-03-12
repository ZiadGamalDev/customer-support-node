import MessageService from './message.service.js';
import messageResponse from './message.response.js';
import logger from '../../utils/logger.js';

class MessageController {
    async all(req, res) {
        try {
            const messages = await MessageService.all(req.params.chatId);
            
            res.status(200).json(messages.map(messageResponse));
        } catch (err) {
            logger.error(err);
            res.status(500).json({ message: 'Failed to fetch messages' });
        }
    }

    async send(req, res) {
        try {
            const message = await MessageService.send(req.user.id, req.body.receiver, req.body.message);

            // req.io.to(receiver).emit('messageReceived', response);

            res.status(201).json(messageResponse(message));
        } catch (err) {
            logger.error(err);
            res.status(400).json({ message: 'Failed to send message' });
        }
    }

    async updateStatus(req, res) {
        try {
            const message = await MessageService.updateStatus(req.params.messageId, req.params.status);

            // req.io.to(message.receiver).emit('messageStatusUpdated', response);
            
            res.status(200).json(messageResponse(message));
        } catch (err) {
            logger.error(err);
            res.status(400).json({ message: 'Failed to update message status' });
        }
    }
}

export default new MessageController();
