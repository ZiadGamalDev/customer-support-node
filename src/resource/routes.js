import { roles } from '../database/enums/user.enum.js';
import authenticate from '../middleware/authenticate.js';
import errorHandler from '../middleware/handle.error.js';
import authRoutes from '../modules/auth/auth.routes.js';
import chatRoutes from '../modules/chat/chat.routes.js';
import devRoutes from '../modules/dev/dev.routes.js';
import emailRoutes from '../modules/email/email.routes.js';
import messageRoutes from '../modules/message/message.routes.js';
import passwordRoutes from '../modules/password/password.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import template from '../utils/template.js';
import notificationRoutes from '../modules/notification/notification.routes.js';
import adminRoutes from '../modules/admin-profile/profile.routes.js';

const resourceRoutes = (app) => {
  app.get('/', (_, res) => { res.end(template('welcome.html')) });
  app.use('/dev', devRoutes);

  app.use('/auth', authRoutes);
  app.use('/email', emailRoutes);
  app.use('/password', passwordRoutes);
  app.use('/profile', profileRoutes);

  app.use('/chats', chatRoutes);
  app.use('/messages', messageRoutes);
  app.use('/notification', notificationRoutes);

  app.use('/admin/profile', authenticate(roles.ADMIN), adminRoutes);
  app.use('/admin/users', authenticate(roles.ADMIN), userRoutes);

  app.use(errorHandler);
};

export default resourceRoutes;
