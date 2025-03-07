import connectDB from '../connection.js';
import userSeeder from './user.seeder.js';

(async () => {
    try {
        await connectDB();

        // Run Seeders: node src/database/seeders/database.seeder.js
        await userSeeder();

        console.log('Database seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Database seeding error:', err.message);
        process.exit(1);
    }
})();
