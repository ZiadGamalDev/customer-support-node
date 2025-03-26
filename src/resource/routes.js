import { roles } from '../database/enums/user.enum.js';
import { runSeeder } from '../database/seeders/database.seeder.js';
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
  app.get('/seed', async (req, res) => {
    console.log('Running database seeder...');
    const result = await runSeeder();
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  });

  app.use('/auth', authRoutes);
  app.use('/email', emailRoutes);
  app.use('/password', passwordRoutes);

  app.use('/profile', authenticate(roles.USER), verify('email'), profileRoutes);
  app.use('/chats', authenticate(roles.CUSTOMER), chatRoutes);
  app.use('/messages', messageRoutes); // temporary remove: authenticate(roles.USER), verify('email')

  app.use('/admin/users', authenticate(roles.ADMIN), userRoutes);

  app.use(errorHandler);
};

export default resourceRoutes;
