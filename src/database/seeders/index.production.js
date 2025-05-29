import { connect } from 'mongoose';
import dotenv from 'dotenv';
import chatSeeder from './chat.seeder.js';
import messageSeeder from './message.seeder.js';
import notificationSeeder from './notification.seeder.js';
import userSeeder from './user.seeder.js';

dotenv.config({ path: '.env.production' });
const MONGO_URI = process.env.MONGO_URI;

const seedAll = async () => {
  try {
    await connect(MONGO_URI);
    console.log('Connected to DB');

    await userSeeder();
    await messageSeeder();
    await chatSeeder();
    await notificationSeeder();

    console.log('Done seeding!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedAll();
