import User from '../../database/models/user.model.js';
import jwt from 'jsonwebtoken';
import { hash, compare } from '../../utils/crypto.js';
import { statuses } from '../../database/enums/user.enum.js';

class AuthService {
    async create(name, email, password) {
        return User.create({
            name,
            email,
            password: await hash(password),
        });
    }

    async generateToken(user) {
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_Token_EXPIRY });
    }

    async validateCredentials(email, password) {
        const user = await User.findOne({ email });

        if (!user || !(await compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }

        return user;
    }

    async login(user) {
        if (user.status === statuses.OFFLINE) {
            user.status = statuses.ONLINE;
        }
        await user.save();
    }

    async logout(user) {
        if (user.status === statuses.ONLINE) {
            user.status = statuses.OFFLINE;
        }
        await user.save();
    }
}

export default new AuthService();
