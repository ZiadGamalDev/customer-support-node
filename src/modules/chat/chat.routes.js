import { Router } from 'express';
import ChatController from './chat.controller.js';
import validate from '../../middleware/validate.js';
import chatValidation from './chat.validation.js';
import authenticate from '../../middleware/authenticate.js';
import { roles } from '../../database/enums/user.enum.js';

const chatRoutes = Router();

/************************************** Agent **************************************/

chatRoutes.get(
  '/agent',
  authenticate(roles.AGENT),
  ChatController.all
);

chatRoutes.get(
  '/agent/show/:chatId',
  authenticate(roles.AGENT),
  validate(chatValidation.chatExists),
  ChatController.show
);

chatRoutes.put(
  '/agent/read/:chatId',
  authenticate(roles.AGENT),
  validate(chatValidation.chatExists),
  ChatController.agentResetUnreadCount
);

chatRoutes.put(
  '/agent/:chatId/:status',
  authenticate(roles.AGENT),
  validate(chatValidation.updateStatus),
  ChatController.agentUpdateStatus
);

/************************************** Customer **************************************/

chatRoutes.post(
  '/customer',
  authenticate(roles.CUSTOMER),
  validate(chatValidation.create),
  ChatController.findOrCreate
);

chatRoutes.put(
  '/customer/read/:chatId',
  authenticate(roles.CUSTOMER),
  validate(chatValidation.chatExists),
  ChatController.customerResetUnreadCount
);

export default chatRoutes;
