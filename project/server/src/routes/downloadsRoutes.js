import { Router } from 'express';
import { getMyDownloads } from '../controllers/downloadController.js';
import { userAuthMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/', userAuthMiddleware, getMyDownloads);

export default router;
