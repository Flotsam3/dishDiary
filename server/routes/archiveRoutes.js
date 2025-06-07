import express from 'express';
import { getAllArchives, archiveRecipe, deleteArchive, deleteAllArchives } from '../controllers/archiveController.js';

const router = express.Router();

router.get('/', getAllArchives);
router.post('/', archiveRecipe);
router.delete('/:id', deleteArchive);
router.delete('/', deleteAllArchives);

export default router;
