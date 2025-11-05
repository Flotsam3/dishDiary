import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import recipeRoutes from './routes/recipeRoutes.js';
import archiveRoutes from './routes/archiveRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Trust proxy when in production (needed for secure cookies behind proxies)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({limit: '10mb'}));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/archives', archiveRoutes);

app.get('/', (req, res) => {
  res.send('Dish Diary API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
