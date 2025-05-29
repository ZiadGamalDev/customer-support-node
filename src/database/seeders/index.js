import connectDB from '../connection.js';
import chatSeeder from './chat.seeder.js';
import messageSeeder from './message.seeder.js';
import notificationSeeder from './notification.seeder.js';
import userSeeder from './user.seeder.js';

const seedAll = async () => {
  try {
    await connectDB();
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
