import authenticate from '../middleware/authenticate.js';
import errorHandler from '../middleware/handle.error.js';
import verify from '../middleware/verify.js';
import authRoutes from '../modules/auth/auth.routes.js';
import chatRoutes from '../modules/chat/chat.routes.js';
import emailRoutes from '../modules/email/email.routes.js';
import messageRoutes from '../modules/message/message.routes.js';
import passwordRoutes from '../modules/password/password.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import template from '../utils/template.js';

const resourceRoutes = (app) => {
  app.get('/', (_, res) => { res.end(template('welcome.html')) });
  app.get('/test', (_, res) => { res.json({ message: 'OK' }); });

  app.use('/auth', authRoutes);
  app.use('/email', emailRoutes);
  app.use('/password', passwordRoutes);

  app.use('/profile', authenticate('user'), verify('email'), profileRoutes);
  app.use('/users', userRoutes);
  app.use('/chats', authenticate('user'), verify('email'), chatRoutes);
  app.use('/messages', authenticate('user'), verify('email'), messageRoutes);

  app.use(errorHandler);
};

export default resourceRoutes;
