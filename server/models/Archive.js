// models/Archive.js
import mongoose from "mongoose";

const ArchiveSchema = new mongoose.Schema(
   {
      recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
      title: { type: String, required: true },
      cookedAt: { type: Date, required: true },
      notes: { type: String },
      stars: { type: Number, default: 0 },
      comment: { type: String },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   { timestamps: true }
);

ArchiveSchema.index({ userId: 1, cookedAt: -1 });

export default mongoose.model("Archive", ArchiveSchema);
