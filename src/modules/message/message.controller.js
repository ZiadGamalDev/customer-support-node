import MessageService from './message.service.js';
import messageResponse from './message.response.js';

class MessageController {
    async all(req, res) {
        try {
            const messages = await MessageService.all(req.params.chatId);
            res.status(200).json(messages.map(messageResponse));
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch messages' });
        }
    }

    async send(req, res) {
        try {
            const sender = req.user.id;
            const { receiver, message } = req.body;

            const newMessage = await MessageService.send({ sender, receiver, message });
            const response = messageResponse(newMessage);

            res.status(201).json(response);

            // Emit socket event after storing the message
            req.io.to(receiver).emit('messageReceived', response);
        } catch (err) {
            res.status(400).json({ message: 'Failed to send message' });
        }
    }

    async update(req, res) {
        try {
            const updatedMessage = await MessageService.update(req.params.messageId, req.body.status);
            const response = messageResponse(updatedMessage);

            res.status(200).json(response);

            // Emit socket event after updating the message status
            req.io.to(updatedMessage.receiver).emit('messageStatusUpdated', response);
        } catch (err) {
            res.status(400).json({ message: 'Failed to update message status' });
        }
    }
}

export default new MessageController();
