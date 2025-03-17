import Joi from 'joi';
import User from '../../database/models/user.model.js';

class PasswordValidation {
    async forgot({ body }) {
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Invalid email format',
                'any.required': 'Email is required',
            }),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        // Check email exists
        if (! await User.findOne({ email: body.email })) {
            return { error: { details: [{ message: 'Email does not exist' }] } };
        }

        return {};
    }

    async reset({ body }) {
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Invalid email format',
                'any.required': 'Email is required',
            }),
            otp: Joi.string().required().messages({
                'any.required': 'OTP is required',
            }),
            newPassword: Joi.string().min(6).required().messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'New password is required',
            }),
        });
        
        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        // Check email exists
        if (! await User.findOne({ email: body.email })) {
            return { error: { details: [{ message: 'Email does not exist' }] } };
        }

        return {};
    }

    async confirm({ body }) {
        const schema = Joi.object({
            password: Joi.string().required().messages({
                'any.required': 'Password is required',
            }),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        return {};
    }
}

export default new PasswordValidation();
