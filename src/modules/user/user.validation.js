import Joi from 'joi';
import { userRolesByAdmin } from '../../database/enums/user.enum.js';
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

    async update({ body, params }) {
        const validRoles = Object.values(userRolesByAdmin);

        if (!params.id || !objectId.validate(params.id)) {
            return { error: { details: [{ message: "User Id is required" }] } };
        }

        const schema = Joi.object({
            name: Joi.string().optional(),
            phone: Joi.string().optional(),
            image: Joi.any(),
            role: Joi.string().valid(...validRoles).optional().messages({
                'any.required': 'Roles is required',
                'any.only': 'Role must be one of: ' + validRoles.join(', '),
            }),
        });

        const { error } = schema.validate({ ...body }, { abortEarly: false });
        if (error) return { error };

        // Check if user exists
        const user = await User.findOne({ _id: params.id });
        if (!user) {
            return { error: { details: [{ message: 'User not found' }] } };
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
