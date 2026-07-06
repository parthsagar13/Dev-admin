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
import { adminAuthMiddleware } from '../middlewares/auth.js';
import { uploadTemplateFiles } from '../middlewares/upload.js';

const router = Router();

router.get('/', getTemplates);
router.get('/dashboard/stats', adminAuthMiddleware, getDashboardStats);
router.get('/download/:id', downloadTemplate);
router.get('/:slug', getTemplateBySlug);
router.post('/upload', adminAuthMiddleware, uploadTemplateFiles, uploadTemplate);
router.patch('/:id', adminAuthMiddleware, updateTemplate);
router.delete('/:id', adminAuthMiddleware, deleteTemplate);

export default router;
