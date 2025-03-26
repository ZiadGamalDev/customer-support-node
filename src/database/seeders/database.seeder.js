import connectDB from '../connection.js';
import userSeeder from './user.seeder.js';

export const runSeeder = async () => {
    try {
        await connectDB();

        // Run Seeders: node src/database/seeders/database.seeder.js
        console.log('Seeding database...');
        await userSeeder();

        console.log('Database seeding completed successfully.');
        return { success: true, message: 'Database seeding completed successfully.' };
    } catch (err) {
        console.error('Database seeding error:', err.message);
        return { success: false, message: err.message };
    }
};
