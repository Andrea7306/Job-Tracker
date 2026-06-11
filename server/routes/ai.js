import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { generateCoverLetter } from '../controllers/aiController.js';

const router = express.Router();

router.post('/cover-letter', protect, generateCoverLetter);

export default router;
