import { Router } from 'express';
import EmailController from './email.controller.js';
import authenticate from '../../middleware/authenticate.js';
import { roles } from '../../database/enums/user.enum.js';
import validate from '../../middleware/validate.js';
import EmailValidation from './email.validation.js';

const emailRoutes = Router();

emailRoutes.post(
  '/send', 
  validate(EmailValidation.exists),
  EmailController.sendVerificationEmail
);

emailRoutes.post(
  '/report',
  authenticate(roles.AGENT),
  validate(EmailValidation.report),
  EmailController.report
);

emailRoutes.get(
  '/verify/:token',
  EmailController.verify
);

export default emailRoutes;
