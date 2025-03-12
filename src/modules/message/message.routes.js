import { Router } from 'express';
import MessageController from './message.controller.js';
import authenticate from '../../middleware/authenticate.js';

const messageRoutes = Router();

messageRoutes.get('/:chatId', authenticate(), MessageController.all);
messageRoutes.post('/', authenticate(), MessageController.send);
messageRoutes.put('/:messageId', authenticate(), MessageController.update);

export default messageRoutes;
