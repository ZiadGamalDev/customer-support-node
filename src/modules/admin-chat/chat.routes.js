import { Router } from 'express';
import ChatController from './chat.controller.js';
import validate from '../../middleware/validate.js';
import chatValidation from './chat.validation.js';

const chatRoutes = Router();

chatRoutes.get(
  '/',
  ChatController.all
);

chatRoutes.get(
  '/:chatId',
  validate(chatValidation.exists),
  ChatController.show
);  

chatRoutes.put(
  '/:chatId',
  validate(chatValidation.update),
  ChatController.update
);

chatRoutes.delete(
  '/:chatId',
  validate(chatValidation.exists),
  ChatController.delete
)

export default chatRoutes;
