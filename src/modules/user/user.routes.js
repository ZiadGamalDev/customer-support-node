import { Router } from 'express';
import UserController from './user.controller.js';
import validate from '../../middleware/validate.js';
import UserValidation from './user.validation.js';
import upload from '../../middleware/upload.js';

const userRoutes = Router();

userRoutes.get(
  '/',
  UserController.index
);

userRoutes.put(
  '/approve', 
  validate(UserValidation.userRole), 
  UserController.approve
);

userRoutes.get(
  '/:id', 
  validate(UserValidation.show), 
  UserController.show
);

userRoutes.post(
  '/',
  upload.single('image'), 
  validate(UserValidation.create),
  UserController.create
);

userRoutes.put(
  '/:id', 
  upload.single('image'), 
  validate(UserValidation.update), 
  UserController.update
);

userRoutes.delete(
  '/:id', 
  validate(UserValidation.exists), 
  UserController.destroy
);

export default userRoutes;
