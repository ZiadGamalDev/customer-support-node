import User from '../../database/models/user.model.js';
import jwt from 'jsonwebtoken';
import template from '../../utils/template.js';
import sendEmail from '../../services/email.js';

class EmailService {
    async sendWelcomeEmail(user) {
        const emailTemplate = template('email/welcome.html');

        await sendEmail(user.email, 'Welcome to our platform', emailTemplate);
    }

    async sendVerificationEmail(user) {
        if (user.emailVerifiedAt) {
            throw new Error('Email is already verified');
        }

        const emailToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EMAIL_EXPIRY });
        const verifyLink = `${process.env.APP_BASE_URL}/email/verify/${emailToken}`;
        const emailTemplate = template('email/verification.html').replace('{{verifyLink}}', verifyLink);

        await sendEmail(user.email, 'Verify your email', emailTemplate);
    }

    async verify(token) {
        let email;
        try {
            ({ email } = jwt.verify(token, process.env.JWT_SECRET));
        } catch (err) {
            throw new Error('Invalid verification link');
        }

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

export default new EmailService();
