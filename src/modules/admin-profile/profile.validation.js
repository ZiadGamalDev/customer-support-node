import Joi from 'joi';

class ProfileValidation {
    profileData({ body }) {
        const schema = Joi.object({
            name: Joi.string()
                .pattern(/^[a-zA-Z\s]+$/)
                .optional()
                .messages({
                    'any.required': 'Name is required',
                    'string.pattern.base': 'Name must only contain letters and spaces',
                }),
            phone: Joi.string()
                .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
                .optional()
                .messages({
                    'string.pattern.base': 'Phone number must be a valid Egyptian number',
                }),
            image: Joi.any(),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        return {};
    }
}

export default new ProfileValidation();
