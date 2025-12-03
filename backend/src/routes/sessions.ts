import { Router } from 'express';
import { sessionsController } from '../controllers/sessionsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', sessionsController.getActiveSessions);
router.get('/:sessionId', sessionsController.getSessionById);
router.post('/create', authenticate, sessionsController.createSession);
router.post('/:sessionId/end', authenticate, sessionsController.endSession);

export default router;
