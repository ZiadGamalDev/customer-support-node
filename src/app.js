import express from 'express';
import cors from 'cors';
import resourceRoutes from './resource/routes.js';

const app = express();

app.use(express.json());

// CORS configuration using environment variables
const allowedOrigins = [
  process.env.ADMIN_FRONTEND_URL,
  process.env.AGENT_FRONTEND_URL,
  process.env.CHAT_FRONTEND_URL,
  process.env.ECOMMERCE_FRONTEND_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

resourceRoutes(app);
app.use('/storage', express.static('public'));

export default app;
