import { Router } from 'express';
import AuthController from './auth.controller.js';
import AuthValidation from './auth.validation.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';
import { roles } from '../../database/enums/user.enum.js';

const authRoutes = Router();

authRoutes.post(
  '/login',
  validate(AuthValidation.login),
  AuthController.login
);

authRoutes.post(
  '/logout',
  authenticate(roles.ADMIN),
  AuthController.logout
);

export default authRoutes;
