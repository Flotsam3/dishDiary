import Recipe from '../models/Recipe.js';
import { v2 as cloudinary } from 'cloudinary';

// Helper to normalize boolean-like values
const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return ['true', '1', 'on', 'yes'].includes(val.toLowerCase());
  return Boolean(val);
};

// Get all recipes (returns user's recipes if authenticated, public recipes if not)
export const getAllRecipes = async (req, res) => {
  try {
    // If user is authenticated, return only their recipes (both public and private)
    if (req.user) {
      const recipes = await Recipe.find({ userId: req.user._id });
      return res.json(recipes);
    }
    // For unauthenticated users, return public recipes
    const recipes = await Recipe.find({ isPublic: true });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get only public recipes
export const getPublicRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isPublic: true });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, duration, ingredients, instructions, portion, description, isPublic } = req.body;
    // Use default image if none provided
    const imageUrl = req.file ? req.file.path : "/default-recipe.jpg"; // Cloudinary URL from Multer or default

    // Ensure ingredients is an array (frontend sends as described)
    const ingredientsArr = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split('\n').map(i => i.trim()).filter(Boolean);

    // Ensure instructions is an array (frontend sends as described)
    const instructionsArr = Array.isArray(instructions)
      ? instructions
      : instructions.split('\n').map(i => i.trim()).filter(Boolean);

    // Require authenticated user to set userId
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const recipe = new Recipe({
      title,
      ingredients: ingredientsArr,
      instructions: instructionsArr,
      duration,
      imageUrl,
      portion: portion || 1,
      description: description || '',
      userId: req.user._id,
      author: req.user.name || req.user.email,
      isPublic: typeof isPublic !== 'undefined' ? parseBoolean(isPublic) : true,
    });

    console.log({recipe});
    
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    let imageUrl = recipe.imageUrl;
    // If a new image is uploaded, delete the old one from Cloudinary
    if (req.file) {
      // Only delete if the old image is a Cloudinary URL (not default)
      if (imageUrl && imageUrl.includes('res.cloudinary.com')) {
        // Extract public_id from the URL
        const match = imageUrl.match(/dish-diary\/(.*)\.[a-zA-Z]+$/);
        if (match && match[1]) {
          const publicId = `dish-diary/${match[1]}`;
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error('Cloudinary delete error:', err.message);
          }
        }
      }
      imageUrl = req.file.path;
    }

    // Only owner may update
    if (!req.user || !recipe.userId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to edit this recipe' });
    }

    // Prepare update fields
    const updateFields = {
      title: req.body.title,
      duration: req.body.duration,
      imageUrl,
    };
    // Handle ingredients and instructions (may be string or array)
    if (req.body.ingredients) {
      updateFields.ingredients = Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : req.body.ingredients.split('\n').map(i => i.trim()).filter(Boolean);
    }
    if (req.body.instructions) {
      updateFields.instructions = Array.isArray(req.body.instructions)
        ? req.body.instructions
        : req.body.instructions.split('\n').map(i => i.trim()).filter(Boolean);
    }
    if (typeof req.body.portion !== 'undefined') {
      updateFields.portion = Number(req.body.portion);
    }
    if (typeof req.body.description !== 'undefined') {
      updateFields.description = req.body.description;
    }
    if (typeof req.body.isPublic !== 'undefined') {
      updateFields.isPublic = parseBoolean(req.body.isPublic);
    }
    const updated = await Recipe.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (!req.user || !recipe.userId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
    }
    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
