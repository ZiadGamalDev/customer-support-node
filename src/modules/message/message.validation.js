import Joi from 'joi';

class MessageValidation {
    send({ body }) {
        const schema = Joi.object({
            receiver: Joi.string().required().messages({ 'any.required': 'Receiver ID is required' }),
            message: Joi.string().required().messages({ 'any.required': 'Message cannot be empty' }),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };
        return {};
    }

    update({ body }) {
        const schema = Joi.object({
            status: Joi.string().valid('delivered', 'seen').required().messages({
                'any.required': 'Status is required',
                'any.only': 'Status must be either "delivered" or "seen"',
            }),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };
        return {};
    }
}

export default new MessageValidation();
