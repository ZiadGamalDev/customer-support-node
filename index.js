import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/database/connection.js';
import { Server } from 'socket.io';
import resourceSockets from './src/resource/sockets.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let server = app.listen(PORT, () => console.log(`Server running at ${BASE_URL}`));

const io = new Server(server, { cors: '*' });

// io.on('connection', (socket) => resourceSockets(socket, io));
