import Joi from 'joi';
import Chat from '../../database/models/chat.model.js';
import User from '../../database/models/user.model.js';
import { statuses } from '../../database/enums/message.enum.js';
import Message from '../../database/models/message.model.js';
import { objectId } from '../../utils/validators.js';

class MessageValidation {
    async chatExistence({ params }) {
        const schema = Joi.object({
            chatId: objectId.required().messages({ 'any.required': 'Chat ID is required' }),
        });

        const { error } = schema.validate(params, { abortEarly: false });
        if (error) return { error };

        // Check if chat exists
        if (! await Chat.exists({ _id: params.chatId })) {
            return { error: { details: [{ message: 'Chat not found' }] } };
        }

        return {};
    }

    async send({ body }) {
        const schema = Joi.object({
            chatId: objectId.required().messages({ 'any.required': 'Chat ID is required' }),
            content: Joi.string().required().messages({ 'any.required': 'Message content cannot be empty' }),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        // Check if chat exists
        if (! await Chat.exists({ _id: body.chatId })) {
            return { error: { details: [{ message: 'Chat not found' }] } };
        }

        return {};
    }

    async updateStatus({ params }) {
        const validStatuses = Object.values(statuses);

        const schema = Joi.object({
            messageId: objectId.required().messages({ 'any.required': 'Message ID is required' }),
            status: Joi.string().valid(...validStatuses).required().messages({
                'any.required': 'Status is required',
                'any.only': 'Status must be one of: ' + validStatuses.join(', '),
            }),
        });

        const { error } = schema.validate(params, { abortEarly: false });
        if (error) return { error };

        // Check if message exists
        if (! await Message.exists({ _id: params.messageId })) {
            return { error: { details: [{ message: 'Message not found' }] } };
        }

        return {};
    }
}

export default new MessageValidation();
