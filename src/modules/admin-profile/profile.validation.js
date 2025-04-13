import Joi from 'joi';

class ProfileValidation {
    profileData({ body }) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(50).optional(),
            phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
            image: Joi.any(),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        return {};
    }
}

export default new ProfileValidation();
