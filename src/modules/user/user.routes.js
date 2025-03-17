import { Router } from 'express';
import UserController from './user.controller.js';
import validate from '../../middleware/validate.js';
import UserValidation from './user.validation.js';
import upload from '../../middleware/upload.js';

const userRoutes = Router();

userRoutes.get('/', UserController.index);
userRoutes.get('/:id', validate(UserValidation.show), UserController.show);
userRoutes.put('/:id', upload.single('image'), validate(UserValidation.update), UserController.update);
userRoutes.delete('/:id', validate(UserValidation.destroy), UserController.destroy);

export default userRoutes;
