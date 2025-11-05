import express from 'express';
import { getAllArchives, archiveRecipe, deleteArchive, deleteAllArchives } from '../controllers/archiveController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllArchives);
router.post('/', authenticate, archiveRecipe);
router.delete('/:id', authenticate, deleteArchive);
router.delete('/', authenticate, deleteAllArchives);

export default router;
