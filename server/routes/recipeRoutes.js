import express from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipeController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', upload.single('image'), createRecipe);
router.put('/:id', upload.single('image'), updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
