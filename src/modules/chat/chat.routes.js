import { Router } from 'express';
import ChatController from './chat.controller.js';
import authenticate from '../../middleware/authenticate.js';

const chatRoutes = Router();

chatRoutes.get('/', authenticate(), ChatController.all);
chatRoutes.post('/', authenticate(), ChatController.findOrCreate);
chatRoutes.put('/:chatId/reset-unread', authenticate(), ChatController.resetUnreadCount);

export default chatRoutes;
