import Joi from 'joi';
import { userRolesByAdmin, userStatusesByAgent } from '../../database/enums/user.enum.js';
import User from '../../database/models/user.model.js';
import { objectId } from '../../utils/validators.js';

class UserValidation {
    async show({ params }) {
        const schema = Joi.object({
            id: objectId.required().messages({ 'any.required': 'User Id is required' }),
        });

        const { error } = schema.validate(params, { abortEarly: false });
        if (error) return { error };

        // Check if user exists
        const user = await User.findOne({ _id: params.id });
        if (!user) {
            return { error: { details: [{ message: 'User not found' }] } };
        }

        // Check if user role is valid
        const validRoles = Object.values(userRolesByAdmin);
        if (!validRoles.includes(user.role)) {
            return { error: { details: [{ message: 'User role must be one of: ' + validRoles.join(', ') }] } };
        }

        return {};
    }

    async create({ body }) {
        const validRoles = Object.values(userRolesByAdmin);

        const schema = Joi.object({
            name: Joi.string()
                .pattern(/^[a-zA-Z\s]+$/)
                .required()
                .messages({
                    'any.required': 'Name is required',
                    'string.pattern.base': 'Name must only contain letters and spaces',
                }),
            email: Joi.string()
                .email()
                .required()
                .messages({
                    'string.email': 'Invalid email format',
                    'any.required': 'Email is required',
                }),
            password: Joi.string()
                .min(8)
                .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/)
                .required()
                .messages({
                    'string.min': 'Password must be at least 8 characters long',
                    'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, and one number',
                    'any.required': 'Password is required',
                }),
            confirmPassword: Joi.string()
                .valid(Joi.ref('password'))
                .required()
                .messages({
                    'any.only': 'Passwords do not match',
                    'any.required': 'Confirmed password is required',
                }),
            role: Joi.string().valid(...validRoles).required().messages({
                'any.required': 'Role is required',
                'any.only': 'Role must be one of: ' + validRoles.join(', '),
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

        // Check if email already exists
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return { error: { details: [{ message: 'Email is already in use' }] } };
        }

        return {};
    }

    async update({ body, params }) {
        const validRoles = Object.values(userRolesByAdmin);
        const validStatuses = Object.values(userStatusesByAgent);

        if (!params.id || !objectId.validate(params.id)) {
            return { error: { details: [{ message: "User Id is required" }] } };
        }

        const schema = Joi.object({
            name: Joi.string().optional(),
            email: Joi.string().email().optional().messages({
                'string.email': 'Invalid email format',
            }),
            phone: Joi.string()
                .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
                .optional()
                .messages({
                    'string.pattern.base': 'Phone number must be a valid Egyptian number',
                }),
            image: Joi.any(),
            role: Joi.string().valid(...validRoles).optional().messages({
                'any.required': 'Roles is required',
                'any.only': 'Role must be one of: ' + validRoles.join(', '),
            }),
            status: Joi.string().valid(...validStatuses).optional().messages({
                'any.required': 'Status is required',
                'any.only': 'Status must be one of: ' + validStatuses.join(', '),
            }),
        });

        const { error } = schema.validate({ ...body }, { abortEarly: false });
        if (error) return { error };

        // Check if user exists
        const user = await User.findOne({ _id: params.id });
        if (!user) {
            return { error: { details: [{ message: 'User not found' }] } };
        }

        // Check if email already exists (excluding the current user's email)
        if (body.email && body.email !== user.email) {
            const existingUser = await User.findOne({ email: body.email });
            if (existingUser) {
                return { error: { details: [{ message: 'Email is already in use' }] } };
            }
        }

        // Check if user role is valid
        if (!validRoles.includes(user.role)) {
            return { error: { details: [{ message: 'User role must be one of: ' + validRoles.join(', ') }] } };
        }

        return {};
    }

    async exists({ params }) {
        const schema = Joi.object({
            id: objectId.required().messages({ 'any.required': 'User Id is required' }),
        });

        const { error } = schema.validate(params, { abortEarly: false });
        if (error) return { error };

        // Check if user exists
        const user = await User.findOne({ _id: params.id });
        if (!user) {
            return { error: { details: [{ message: 'User not found' }] } };
        }

        // Check if user role is valid
        const validRoles = Object.values(userRolesByAdmin);
        if (!validRoles.includes(user.role)) {
            return { error: { details: [{ message: 'User role must be one of: ' + validRoles.join(', ') }] } };
        }

        return {};
    }

    async userRole({ body }) {
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Invalid email format',
            }),
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) return { error };

        // Check if user exists
        const user = await User.findOne({ email: body.email });
        if (!user) {
            return { error: { details: [{ message: 'User not found' }] } };
        }

        // Check if user role is roles.USER
        if (user.role !== userRolesByAdmin.USER) {
            return { error: { details: [{ message: 'User role must be: user' }] } };
        }

        return {};
    }
}

export default new UserValidation();
