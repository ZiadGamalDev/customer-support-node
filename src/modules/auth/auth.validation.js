import Joi from 'joi';
import User from '../../database/models/user.model.js';

class AuthValidation {
    async register({ body }) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                'any.required': 'Name is required',
            }),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required().messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required',
            }),
            confirmedPassword: Joi.string()
                .valid(Joi.ref('password'))
                .required()
                .messages({
                    'any.only': 'Passwords do not match',
                    'any.required': 'Confirmed password is required',
                }),
            phone: Joi.string().optional(),
        });

        const { error } = await schema.validateAsync(body, { abortEarly: false });
        if (error) return { error };

        // Check unique email and phone
        if (await User.findOne({ email: body.email })) {
            return { error: { details: [{ message: 'Email already exists' }] } };
        }
        if (body.phone) {
            if (await User.findOne({ phone: body.phone })) {
                return { error: { details: [{ message: 'Phone number already exists' }] } };
            }
        }

        return {};
    }

    async login({ body }) {
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Invalid email',
                'any.required': 'Email is required',
            }),
            password: Joi.string().required().messages({
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
}

export default new AuthValidation();
