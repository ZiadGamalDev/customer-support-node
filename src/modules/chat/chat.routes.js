import { Router } from 'express';
import ChatController from './chat.controller.js';
import validate from '../../middleware/validate.js';
import chatValidation from './chat.validation.js';
import authenticate from '../../middleware/authenticate.js';
import { roles } from '../../database/enums/user.enum.js';

const chatRoutes = Router();

chatRoutes.get(
  '/agent',
  authenticate(roles.AGENT),
  ChatController.all
);

chatRoutes.post(
  '/customer',
  authenticate(roles.CUSTOMER),
  ChatController.findOrCreate
);

chatRoutes.put(
  '/agent/read/:chatId',
  authenticate(roles.AGENT),
  validate(chatValidation.resetUnreadCount),
  ChatController.agentResetUnreadCount
);

chatRoutes.put(
  '/customer/read/:chatId',
  authenticate(roles.CUSTOMER),
  validate(chatValidation.resetUnreadCount),
  ChatController.customerResetUnreadCount
);

chatRoutes.put(
  '/agent/:chatId/:status',
  authenticate(roles.AGENT),
  validate(chatValidation.updateStatus),
  ChatController.agentUpdateStatus
);

export default chatRoutes;
