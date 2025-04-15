import Joi from 'joi';
import User from '../../database/models/user.model.js';
import { roles } from '../../database/enums/user.enum.js';

class EmailValidation {
	async exists({ body }) {
		const schema = Joi.object({
			email: Joi.string().email().required().messages({
				'string.email': 'Invalid email',
				'any.required': 'Email is required',
			}),
		});

		const { error } = schema.validate(body, { abortEarly: false });
		if (error) return { error };

		// Check email exists
		const user = await User.findOne({ email: body.email });
		if (!user) {
			return { error: { details: [{ message: 'Email does not exist' }] } };
		}

		return {};
	}

	async report({ body }) {
		const schema = Joi.object({
			email: Joi.string().email().required().messages({
				'string.email': 'Invalid email',
				'any.required': 'Email is required',
			}),
			subject: Joi.string().required().messages({
				'any.required': 'Subject is required',
			}),
			message: Joi.string().required().messages({
				'any.required': 'Message is required',
			}),
		});

		const { error } = schema.validate(body, { abortEarly: false });
		if (error) return { error };

		// Check email exists
		const user = await User.findOne({ email: body.email });
		if (!user) {
			return { error: { details: [{ message: 'Email does not exist' }] } };
		}

		// Check email of admin
		if (user.role !== roles.ADMIN) {
			return { error: { details: [{ message: 'Email is not an admin' }] } };
		}

		return {};
	}
}

export default new EmailValidation();
