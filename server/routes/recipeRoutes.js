import express from 'express';
import {
  getAllRecipes,
  getPublicRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipeController.js';
import upload from '../middleware/upload.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicRecipes);

// Main route - optionalAuthenticate will attach req.user if cookie present
router.get('/', optionalAuthenticate, getAllRecipes);
router.get('/:id', getRecipeById);
// Creating/updating/deleting recipes require authentication
router.post('/', authenticate, upload.single('image'), createRecipe);
router.put('/:id', authenticate, upload.single('image'), updateRecipe);
router.delete('/:id', authenticate, deleteRecipe);

export default router;
