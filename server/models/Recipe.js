import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true }, // array of strings
  instructions: { type: [String], required: true }, // array of strings
  duration: { type: String, required: false }, // Duration in minutes
  imageUrl: { type: String, required: false },
  cooked: { type: [String], default: [] }, // array of ISO date strings
  portion: { type: Number, required: false, default: 1 }, // default portion size
  description: { type: String, required: false, default: '' } // extra description
}, { timestamps: true });

export default mongoose.model('Recipe', RecipeSchema);
