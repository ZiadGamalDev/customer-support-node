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
            newPassword: Joi.string()
                .min(8)
                .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/)
                .required()
                .messages({
                    'string.min': 'Password must be at least 8 characters long',
                    'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, and one number',
                    'any.required': 'Password is required',
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

    async update({ body }) {
        const schema = Joi.object({
            oldPassword: Joi.string().required().messages({
                'any.required': 'Old password is required',
            }),
            newPassword: Joi.string()
                .min(8)
                .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/)
                .required()
                .messages({
                    'string.min': 'New password must be at least 8 characters long',
                    'string.pattern.base': 'New password must include at least one uppercase letter, one lowercase letter, and one number',
                    'any.required': 'New password is required',
                }),
            confirmPassword: Joi.string()
                .valid(Joi.ref('newPassword'))
                .required()
                .messages({
                    'any.only': 'Confirm password must match new password',
                    'any.required': 'Confirm password is required',
                }),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        return {};
    }
}

export default new PasswordValidation();
