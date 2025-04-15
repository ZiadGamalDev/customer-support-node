import User from '../../database/models/user.model.js';
import jwt from 'jsonwebtoken';
import { compare } from '../../utils/crypto.js';
import { roles } from '../../database/enums/user.enum.js';

class AuthService {
	async generateToken(user) {
		return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_Token_EXPIRY });
	}

	async validateCredentials(email, password) {
		const user = await User.findOne({ email });

		if (!user || !(await compare(password, user.password))) {
			throw new Error('Invalid email or password');
		}

		return user;
	}

	async authenticateAdmin(user) {
		if (user.role !== roles.ADMIN) {
			throw new Error('Access denied. Only agents can log in.');
		}
	}
}

export default new AuthService();
