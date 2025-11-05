// models/Recipe.js
import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      ingredients: { type: [String], required: true },
      instructions: { type: [String], required: true },
      duration: { type: String, required: false },
      imageUrl: { type: String, required: false },
      cooked: { type: [String], default: [] },
      portion: { type: Number, required: false, default: 1 },
      description: { type: String, required: false, default: "" },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      isPublic: {
         type: Boolean,
         default: true,
      },
      author: {
         type: String,
         required: false,
      },
   },
   { timestamps: true }
);

RecipeSchema.index({ userId: 1, isPublic: 1 });

export default mongoose.model("Recipe", RecipeSchema);
