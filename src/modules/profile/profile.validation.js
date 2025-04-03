import Joi from 'joi';
import { statuses } from '../../database/enums/user.enum.js';

class ProfileValidation {
    updateProfile({ body }) {
        const schema = Joi.object({
            name: Joi.string().optional(),
            phone: Joi.string().optional(),
            image: Joi.any(),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        return {};
    }

    async updateStatus({ params }) {
        const validStatuses = Object.values(statuses);
  
        const schema = Joi.object({
            status: Joi.string().valid(...validStatuses).required().messages({
                'any.required': 'Status is required',
                'any.only': 'Status must be one of: ' + validStatuses.join(', '),
            }),
        });
  
        const { error } = schema.validate(params, { abortEarly: false });
        if (error) return { error };
    
        return {};
    }
}

export default new ProfileValidation();
