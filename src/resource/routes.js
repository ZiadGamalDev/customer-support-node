import authRoutes from '../modules/auth/auth.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import template from '../utils/template.js';

const resourceRoutes = (app) => {
  app.get('/', (_, res) => { res.end(template('welcome.html')) });
  app.get('/test', (_, res) => { res.json({ message: 'OK' }); });

  app.use('/auth', authRoutes);
  app.use('/profile', profileRoutes);
  app.use('/users', userRoutes);
};

export default resourceRoutes;
