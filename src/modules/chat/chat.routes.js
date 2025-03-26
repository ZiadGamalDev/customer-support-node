import { Router } from 'express';
import ChatController from './chat.controller.js';
import validate from '../../middleware/validate.js';
import chatValidation from './chat.validation.js';

const chatRoutes = Router();

chatRoutes.get('/', ChatController.all);
chatRoutes.post('/', ChatController.findOrCreate);
chatRoutes.put('/:chatId/read', validate(chatValidation.resetUnreadCount), ChatController.resetUnreadCount);

export default chatRoutes;
