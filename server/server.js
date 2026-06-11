import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import aiRoutes from './routes/ai.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => res.json({ message: 'Job Tracker API running ✓' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
