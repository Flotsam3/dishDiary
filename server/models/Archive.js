import mongoose from 'mongoose';

const ArchiveSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  title: { type: String, required: true },
  cookedAt: { type: Date, required: true },
  notes: { type: String },
  stars: { type: Number, default: 0 },
  comment: { type: String }
}, { timestamps: true });

export default mongoose.model('Archive', ArchiveSchema);
