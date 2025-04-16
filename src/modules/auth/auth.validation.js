import Joi from 'joi';
import User from '../../database/models/user.model.js';

class AuthValidation {
	async register({ body }) {
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
			confirmedPassword: Joi.string()
				.valid(Joi.ref('password'))
				.required()
				.messages({
					'any.only': 'Passwords do not match',
					'any.required': 'Confirmed password is required',
				}),
			phone: Joi.string()
				.pattern(/^01[0-2,5]{1}[0-9]{8}$/)
				.optional()
				.messages({
					'string.pattern.base': 'Phone number must be a valid Egyptian number',
				}),
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
