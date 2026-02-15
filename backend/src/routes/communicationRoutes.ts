import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  createCommunication,
  getCommunications,
  getCommunicationById,
  updateCommunication,
  deleteCommunication,
} from '../controllers/communicationController';

const router = express.Router();

router.route('/')
  .post(protect, authorize(['admin']), createCommunication)
  .get(protect, getCommunications);

router.route('/:id')
  .get(protect, getCommunicationById)
  .put(protect, authorize(['admin']), updateCommunication)
  .delete(protect, authorize(['admin']), deleteCommunication);

export default router;
