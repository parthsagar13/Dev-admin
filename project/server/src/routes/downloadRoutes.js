import { Router } from 'express';
import { secureDownload } from '../controllers/downloadController.js';
import { userAuthMiddleware } from '../middlewares/auth.js';
import { downloadRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.get('/:templateId', downloadRateLimiter, userAuthMiddleware, secureDownload);

export default router;
