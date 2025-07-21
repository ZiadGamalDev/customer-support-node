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
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import template from '../utils/template.js';
import notificationRoutes from '../modules/notification/notification.routes.js';
import adminAuthRoutes from '../modules/admin-auth/auth.routes.js';
import adminProfileRoutes from '../modules/admin-profile/profile.routes.js';
import adminDashboardRoutes from '../modules/admin-dashboard/dashboard.routes.js';
import adminUserRoutes from '../modules/user/user.routes.js';
import adminChatRoutes from '../modules/admin-chat/chat.routes.js';

const resourceRoutes = (app) => {
  app.get('/', (_, res) => { 
    res.setHeader('Content-Type', 'text/html');
    res.end(template('welcome.html'));
  });
  app.use('/dev', devRoutes);

  app.use('/auth', authRoutes);
  app.use('/email', emailRoutes);
  app.use('/password', passwordRoutes);

  app.use('/profile', authenticate(roles.AGENT), profileRoutes);
  app.use('/dashboard', authenticate(roles.AGENT), dashboardRoutes);

  app.use('/chats', chatRoutes);
  app.use('/messages', messageRoutes);
  app.use('/notification', notificationRoutes);

  app.use('/admin/auth', adminAuthRoutes);

  app.use('/admin/profile', authenticate(roles.ADMIN), adminProfileRoutes);
  app.use('/admin/dashboard', authenticate(roles.ADMIN), adminDashboardRoutes);

  app.use('/admin/users', authenticate(roles.ADMIN), adminUserRoutes);
  app.use('/admin/chats', authenticate(roles.ADMIN), adminChatRoutes);

  // 404 handler for unmatched routes
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.originalUrl });
  });

  app.use(errorHandler);
};

export default resourceRoutes;
