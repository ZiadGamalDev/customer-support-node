import { Router } from 'express';
import AuthController from './auth.controller.js';
import AuthValidation from './auth.validation.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';

const authRoutes = Router();

authRoutes.post('/register', validate(AuthValidation.register), AuthController.register);
authRoutes.post('/login', validate(AuthValidation.login), AuthController.login);
authRoutes.post('/logout', authenticate('user'), AuthController.logout);

export default authRoutes;
