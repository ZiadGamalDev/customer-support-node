import Joi from 'joi';
import Chat from '../../database/models/chat.model.js';
import { objectId } from '../../utils/validators.js';
import { chatStatusesByAgent } from '../../database/enums/chat.enum.js';
import User from '../../database/models/user.model.js';
import { roles } from '../../database/enums/user.enum.js';

class ChatValidation {
  async exists({ params }) {
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

  async update({ body, params }) {
    if (!params.chatId || !objectId.validate(params.chatId)) {
      return { error: { details: [{ message: 'Chat ID is required' }] } };
    }

    const validStatuses = Object.values(chatStatusesByAgent);

    const schema = Joi.object({
      agentId: objectId.messages({
        'any.required': 'Agent ID is required',
      }),
      status: Joi.string().valid(...validStatuses).messages({
        'any.only': 'Status must be one of: ' + validStatuses.join(', '),
      }),
      title: Joi.string().min(3).max(100).messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must not exceed 100 characters',
      }),
      description: Joi.string().min(10).max(500).messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description must not exceed 500 characters',
      }),
    });

    const { error } = schema.validate(body, { abortEarly: false });
    if (error) return { error };

    // Check if chat exists
    const chat = await Chat.findOne({ _id: params.chatId });
    if (!chat) {
      return { error: { details: [{ message: 'Chat not found' }] } };
    }

    // check if agent exists
    if (body.agentId) {
      const agent = await User.findOne({ _id: body.agentId, role: roles.AGENT });
      if (!agent) {
        return { error: { details: [{ message: 'Agent not found' }] } };
      }
    }

    return {};
  }
}

export default new ChatValidation();
