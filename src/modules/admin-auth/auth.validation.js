import Joi from 'joi';
import User from '../../database/models/user.model.js';

class AuthValidation {
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
