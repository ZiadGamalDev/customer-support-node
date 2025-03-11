import express from 'express';
import cors from 'cors';
import resourceRoutes from './resource/routes.js';

const app = express();

app.use(express.json());
app.use(cors());

resourceRoutes(app);
app.use('/storage', express.static('storage'));

export default app;
