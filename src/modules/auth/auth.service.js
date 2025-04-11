import User from '../../database/models/user.model.js';
import jwt from 'jsonwebtoken';
import { hash, compare } from '../../utils/crypto.js';

class AuthService {
    async create(name, email, password) {
        return User.create({
            name,
            email,
            password: await hash(password),
        });
    }

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
}

export default new AuthService();
