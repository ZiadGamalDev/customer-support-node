import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/database/connection.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

app.listen(PORT, () => console.log(`Server running at ${BASE_URL}`));
