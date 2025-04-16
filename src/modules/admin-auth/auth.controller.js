import AuthService from './auth.service.js';
import authResponse from './auth.response.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await AuthService.validateCredentials(email, password);
      await AuthService.authenticateAdmin(user);
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
