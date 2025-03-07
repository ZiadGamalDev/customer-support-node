import { Router } from 'express';
import ProfileController from './profile.controller.js';
import ProfileValidation from './profile.validation.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';
import upload from '../../middleware/upload.js';

const profileRoutes = Router();

profileRoutes.get('/', authenticate('user'), ProfileController.show);
profileRoutes.put('/', authenticate('user'), validate(ProfileValidation.updateProfile), upload.single('image'), ProfileController.update);

export default profileRoutes;
