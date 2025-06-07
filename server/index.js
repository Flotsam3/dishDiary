import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import recipeRoutes from './routes/recipeRoutes.js';
import archiveRoutes from './routes/archiveRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/recipes', recipeRoutes);
app.use('/api/archives', archiveRoutes);

app.get('/', (req, res) => {
  res.send('Dish Diary API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
