import PasswordService from './password.service.js';

class AuthController {
    async forgot(req, res, next) {
        try {
            const { email } = req.body;
            
            await PasswordService.sendResetEmail(email);

            res.status(200).json({ message: 'Password reset link sent to your email' });
        } catch (err) {
            next(err);
        }
    }

    async reset(req, res, next) {
        try {
            const { email, otp, newPassword } = req.body;
    
            await PasswordService.reset(email, otp, newPassword);
    
            res.status(200).json({ message: 'Password reset successfully'});
        } catch (err) {
            next(err);
        }
    }

    async confirm(req, res, next) {
        try {
            const { password } = req.body;

            await PasswordService.confirm(req.user, password);

            res.status(200).json({ message: 'Password confirmed successfully' });
        } catch (err) {
            next(err)
        }
    }
}

export default new AuthController();
