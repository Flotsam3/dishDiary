import Archive from '../models/Archive.js';
import Recipe from '../models/Recipe.js';

// Get all archived recipes
export const getAllArchives = async (req, res) => {
  try {
    const archives = await Archive.find().sort({ cookedAt: -1 });
    res.json(archives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Archive a recipe
export const archiveRecipe = async (req, res) => {
  try {
    const { recipeId, title, cookedAt, notes, stars, comment } = req.body;
    const archive = new Archive({ recipeId, title, cookedAt, notes, stars, comment });
    await archive.save();
    // Also update the recipe's cooked array
    await Recipe.findByIdAndUpdate(
      recipeId,
      { $push: { cooked: cookedAt } },
      { new: true }
    );
    res.status(201).json(archive);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a single archive entry
export const deleteArchive = async (req, res) => {
  try {
    const archive = await Archive.findByIdAndDelete(req.params.id);
    if (!archive) return res.status(404).json({ error: 'Archive entry not found' });
    res.json({ message: 'Archive entry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete all archive entries
export const deleteAllArchives = async (req, res) => {
  try {
    await Archive.deleteMany({});
    res.json({ message: 'All archive entries deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
