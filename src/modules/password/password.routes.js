import { Router } from 'express';
import PasswordController from './password.controller.js';
import PasswordValidation from './password.validation.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';

const passwordRoutes = Router();

passwordRoutes.post("/forgot", validate(PasswordValidation.forgot), PasswordController.forgot);
passwordRoutes.post("/reset", validate(PasswordValidation.reset), PasswordController.reset);
passwordRoutes.post("/confirm", authenticate('user'), validate(PasswordValidation.confirm), PasswordController.confirm);

export default passwordRoutes;
