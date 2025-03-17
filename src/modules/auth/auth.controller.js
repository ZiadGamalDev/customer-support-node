import AuthService from './auth.service.js';
import EmailService from '../email/email.service.js';
import authResponse from './auth.response.js';

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            
            const user = await AuthService.create(name, email, password);
            const token = await AuthService.generateToken(user);
            await EmailService.sendWelcomeEmail(user);
            await EmailService.sendVerificationEmail(user);

            return res.status(201).json(authResponse(user, token));
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await AuthService.validateCredentials(email, password);
            const token = await AuthService.generateToken(user);

            res.status(200).json(authResponse(user, token));
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
