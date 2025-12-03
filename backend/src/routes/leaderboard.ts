import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', leaderboardController.getLeaderboard);
router.post('/submit', authenticate, leaderboardController.submitScore);

export default router;
