import User from '../../database/models/user.model.js';
import jwt from 'jsonwebtoken';
import { hash, compare } from '../../utils/crypto.js';
import template from '../../utils/template.js';
import sendEmail from '../../services/email.js';

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

    async sendWelcomeEmail(user) {
        const emailTemplate = template('email', 'welcome.html');

        await sendEmail(user.email, 'Welcome to our platform', emailTemplate);
    }

    async sendVerificationEmail(user) {
        const emailToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EMAIL_EXPIRY });
        const verifyLink = `${process.env.APP_BASE_URL}/auth/verify/${emailToken}`;
        const emailTemplate = template('email', 'verification.html').replace('{{verifyLink}}', verifyLink);
        
        await sendEmail(user.email, 'Verify your email', emailTemplate);
    }

    async verifyEmail(token) {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.emailVerifiedAt) {
            throw new Error('Email is already verified');
        }

        user.emailVerifiedAt = Date.now();
        await user.save();

        return user;
    }
}

export default new AuthService();
