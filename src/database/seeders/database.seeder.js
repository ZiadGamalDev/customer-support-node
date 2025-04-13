import connectDB from '../connection.js';
import chatSeeder from './chat.seeder.js';
import messageSeeder from './message.seeder.js';
import notificationSeeder from './notification.seeder.js';
import userSeeder from './user.seeder.js';

export const runSeeder = async () => {
    try {
        await connectDB();

        console.log('Seeding database...');
        await userSeeder();
        await messageSeeder();
        await chatSeeder();
        await notificationSeeder();

        console.log('Database seeding completed successfully.');
        return { success: true, message: 'Database seeding completed successfully.' };
    } catch (err) {
        console.error('Database seeding error:', err.message);
        return { success: false, message: err.message };
    }
};
