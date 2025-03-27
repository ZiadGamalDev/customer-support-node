import { Router } from 'express';
import { runSeeder } from '../../database/seeders/database.seeder.js';

const devRoutes = Router();

devRoutes.get('/test', (_, res) => { res.json({ message: 'OK' }); });

devRoutes.get('/seed', async (_, res) => {
  console.log('Running database seeder...');

  const result = await runSeeder();

  return result.success
    ? res.status(200).json(result)
    : res.status(500).json(result);
});

export default devRoutes;
