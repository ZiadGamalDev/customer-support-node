import { Router } from 'express';
import EmailController from './email.controller.js';
import authenticate from '../../middleware/authenticate.js';
import { roles } from '../../database/enums/user.enum.js';

const emailRoutes = Router();

emailRoutes.get('/send', authenticate(roles.USER), EmailController.sendVerificationEmail);
emailRoutes.get('/verify/:token', EmailController.verify);

export default emailRoutes;
