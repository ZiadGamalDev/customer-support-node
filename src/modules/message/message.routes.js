import { Router } from 'express';
import MessageController from './message.controller.js';
import validate from '../../middleware/validate.js';
import MessageValidation from './message.validation.js';
import { roles } from '../../database/enums/user.enum.js';
import authenticate from '../../middleware/authenticate.js';

const messageRoutes = Router();

messageRoutes.get(
  '/customer/:chatId',
  authenticate(roles.CUSTOMER),
  validate(MessageValidation.chatExistence),
  MessageController.all
);

messageRoutes.get(
  '/agent/:chatId',
  authenticate(roles.AGENT),
  validate(MessageValidation.chatExistence),
  MessageController.all
);

messageRoutes.post(
  '/customer/send',
  authenticate(roles.CUSTOMER),
  validate(MessageValidation.send),
  MessageController.customerSend
);

messageRoutes.post(
  '/agent/send',
  authenticate(roles.AGENT),
  validate(MessageValidation.send),
  MessageController.agentSend
);

messageRoutes.put(
  '/customer/:messageId/:status',
  authenticate(roles.CUSTOMER),
  validate(MessageValidation.updateStatus),
  MessageController.customerUpdateStatus
);

messageRoutes.put(
  '/agent/:messageId/:status',
  authenticate(roles.AGENT),
  validate(MessageValidation.updateStatus),
  MessageController.agentUpdateStatus
);

export default messageRoutes;
