import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { message: 'Server is running' } });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Catch-all for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

export default app;
