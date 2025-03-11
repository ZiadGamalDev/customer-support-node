import AuthService from './auth.service.js';
import authResponse from './auth.response.js';

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            
            const user = await AuthService.create(name, email, password);
            const token = await AuthService.generateToken(user);
            await AuthService.sendWelcomeEmail(user);
            await AuthService.sendVerificationEmail(user);

            return res.status(201).json(authResponse(user, token));
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await AuthService.validateCredentials(email, password);
            const token = await AuthService.generateToken(user);

            res.status(200).json(authResponse(user, token));
        } catch (err) {
            res.status(400).json({ message: err.message || 'Invalid credentials' });
        }
    }

    async logout(req, res) {
        try {
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal server error' });
        }
    }

    async sendVerificationEmail(req, res) {
        try {
            await AuthService.sendVerificationEmail(req.user);
            
            res.status(200).json({ message: 'Verification email sent successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal server error' });
        }
    }

    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            
            await AuthService.verifyEmail(token);
            
            res.send('<h1>Email Verified Successfully</h1>');
        } catch (err) {
            res.status(400).send(`<h1>${err.message}</h1>`);
        }
    }
}

export default new AuthController();
