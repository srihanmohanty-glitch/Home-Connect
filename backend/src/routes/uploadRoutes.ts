import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { uploadPdf, getPdfs } from '../controllers/uploadController';

const router = express.Router();

router.route('/pdf')
  .post(protect, authorize(['admin']), uploadPdf)
  .get(protect, getPdfs); // Example: Only admin can upload, all authenticated can view list

export default router;
