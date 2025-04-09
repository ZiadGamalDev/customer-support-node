import Joi from 'joi';
import Chat from '../../database/models/chat.model.js';
import { objectId } from '../../utils/validators.js';
import { chatStatusesByAgent } from '../../database/enums/chat.enum.js';

class ChatValidation {
  async resetUnreadCount({ params }) {
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
