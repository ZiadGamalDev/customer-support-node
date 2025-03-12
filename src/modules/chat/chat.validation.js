import Joi from 'joi';
import User from '../../database/models/user.model.js';
import Chat from '../../database/models/chat.model.js';
import { objectId } from '../../utils/validators.js';

class ChatValidation {
  async findOrCreate({ body }) {
    const schema = Joi.object({
      receiver: objectId.required().messages({ 'any.required': 'Receiver ID is required' }),
    });

    const { error } = schema.validate(body, { abortEarly: false });
    if (error) return { error };

    // Check if receiver exists
    if (! await User.exists({ _id: body.receiver })) {
      return { error: { details: [{ message: 'Receiver not found' }] } };
    }

    return {};
  }

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
}

export default new ChatValidation();
