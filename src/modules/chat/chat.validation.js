import Joi from 'joi';
import Chat from '../../database/models/chat.model.js';
import { objectId } from '../../utils/validators.js';
import { chatStatusesByAgent } from '../../database/enums/chat.enum.js';

class ChatValidation {
  async create({ body }) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(100).optional().allow('').messages({
        'string.base': 'Title must be a string',
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must not exceed 100 characters',
      }),
      description: Joi.string().min(10).max(500).optional().allow('').messages({
        'string.base': 'Description must be a string',
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description must not exceed 500 characters',
      }),
    });

    const { error } = schema.validate(body, { abortEarly: false });
    if (error) return { error };

    return {};
  }

  async chatExists({ params }) {
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

  async updateStatus({ params }) {
    const validStatuses = Object.values(chatStatusesByAgent);

    const schema = Joi.object({
      chatId: objectId.required().messages({ 'any.required': 'Chat ID is required' }),
      status: Joi.string().valid(...validStatuses).required().messages({
        'any.required': 'Status is required',
        'any.only': 'Status must be one of: ' + validStatuses.join(', '),
      }),
    });

    const { error } = schema.validate(params, { abortEarly: false });
    if (error) return { error };

    // Check if chat exists
    if (! await Chat.exists({ _id: params.chatId })) {
      return { error: { details: [{ message: 'Chat not found' }] } };
    }

    return {};
  }
}

export default new ChatValidation();
