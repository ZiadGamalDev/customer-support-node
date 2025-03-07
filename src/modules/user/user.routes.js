import { Router } from 'express';
import UserController from './user.controller.js';
import authenticate from '../../middleware/authenticate.js';

const userRoutes = Router();

userRoutes.get('/', authenticate('admin'), UserController.index);

export default userRoutes;
