import { Router } from 'express';
import {
  getTemplates,
  getTemplateBySlug,
  uploadTemplate,
  updateTemplate,
  deleteTemplate,
  downloadTemplate,
  getDashboardStats,
} from '../controllers/templateController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { uploadTemplateFiles } from '../middlewares/upload.js';

const router = Router();

router.get('/', getTemplates);
router.get('/dashboard/stats', authMiddleware, getDashboardStats);
router.get('/download/:id', downloadTemplate);
router.get('/:slug', getTemplateBySlug);
router.post('/upload', authMiddleware, uploadTemplateFiles, uploadTemplate);
router.patch('/:id', authMiddleware, updateTemplate);
router.delete('/:id', authMiddleware, deleteTemplate);

export default router;
