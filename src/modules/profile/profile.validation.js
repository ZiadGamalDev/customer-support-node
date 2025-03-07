import Joi from 'joi';

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
}

export default new ProfileValidation();
