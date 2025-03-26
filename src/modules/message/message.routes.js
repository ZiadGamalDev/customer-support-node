import { Router } from 'express';
import MessageController from './message.controller.js';
import validate from '../../middleware/validate.js';
import MessageValidation from './message.validation.js';

const messageRoutes = Router();

messageRoutes.get('/:chatId', validate(MessageValidation.all), MessageController.all);
messageRoutes.post('/', validate(MessageValidation.send), MessageController.create);
messageRoutes.put('/:messageId/:status', validate(MessageValidation.updateStatus), MessageController.updateStatus);

export default messageRoutes;
