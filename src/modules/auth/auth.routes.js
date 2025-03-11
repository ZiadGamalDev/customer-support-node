import { Router } from 'express';
import AuthController from './auth.controller.js';
import AuthValidation from './auth.validation.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';
import verify from '../../middleware/verify.js';

const authRoutes = Router();

authRoutes.post('/register', validate(AuthValidation.register), AuthController.register);
authRoutes.post('/login', validate(AuthValidation.login), AuthController.login);
authRoutes.post('/logout', authenticate('user'), AuthController.logout);
authRoutes.get('/verify/send', authenticate('user'), AuthController.sendVerificationEmail);
authRoutes.get('/verify/:token', AuthController.verifyEmail);

export default authRoutes;
