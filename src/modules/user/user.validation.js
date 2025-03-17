import Joi from 'joi';
import { roles } from '../../database/enums/user.enum.js';
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
        if (! await User.exists({ _id: params.id })) {
            return { error: { details: [{ message: 'User not found' }] } };
        }

        return {};
    }

    async update({ body, params }) {
        const validRoles = Object.values(roles);

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
        if (! await User.exists({ _id: params.id })) {
            return { error: { details: [{ message: 'User not found' }] } };
        }

        return {};
    }

    async destroy({ params }) {
        const schema = Joi.object({
            id: objectId.required().messages({ 'any.required': 'User Id is required' }),
        });

        const { error } = schema.validate(params, { abortEarly: false });
        if (error) return { error };

        // Check if user exists
        if (! await User.exists({ _id: params.id, deletedAt: null })) {
            return { error: { details: [{ message: 'User not found' }] } };
        }

        return {};
    }
}

export default new UserValidation();
