import { Router } from 'express';
import EmailController from './email.controller.js';
import authenticate from '../../middleware/authenticate.js';

const emailRoutes = Router();

emailRoutes.get('/send', authenticate('user'), EmailController.sendVerificationEmail);
emailRoutes.get('/verify/:token', EmailController.verify);

export default emailRoutes;
