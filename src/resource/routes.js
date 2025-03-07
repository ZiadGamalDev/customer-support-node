import authRoutes from '../modules/auth/auth.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';
import userRoutes from '../modules/user/user.routes.js';

const resourceRoutes = (app) => {
  app.use('/auth', authRoutes);
  app.use('/profile', profileRoutes);
  app.use('/users', userRoutes);
};

export default resourceRoutes;
