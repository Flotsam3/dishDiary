# Dish Diary

Dish Diary is a modern MERN stack recipe manager that helps you organize, archive, and discover your favorite dishes. It features a Vite-powered React frontend and an Express/MongoDB backend, with Cloudinary integration for image uploads.

## Features
- Add, edit, and delete recipes with images
- Archive cooked recipes with ratings, comments, and dates
- Search recipes by title or ingredients
- Responsive, modern UI with Tailwind CSS
- Cloudinary image upload support

## Tech Stack
- **Frontend:** React (Vite, JavaScript, Tailwind CSS)
- **Backend:** Express.js (ES modules), MongoDB (Mongoose)
- **Image Uploads:** Cloudinary

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB
- Cloudinary account

### 1. Clone the repository
```bash
# Clone the repo
git clone <your-repo-url>
cd dishDiary
```

### 2. Setup the Backend
```bash
cd server
cp .env.example .env # or create .env manually
# Fill in your MongoDB and Cloudinary credentials in .env
npm install
npm run dev # or npm start
```

### 3. Setup the Frontend
```bash
cd ../frontend
cp .env.example .env # or create .env manually
# Set VITE_API_BASE_URL to your backend URL (e.g. http://localhost:5500/api)
npm install
npm run dev
```

### 4. Open the App
Visit [http://localhost:5173](http://localhost:5173) in your browser (default Vite port).

## Environment Variables
- **Backend (`server/.env`)**
  - `MONGODB_URI` - MongoDB connection string
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials
  - `PORT` - Backend server port (default: 5500)
- **Frontend (`frontend/.env`)**
  - `VITE_API_BASE_URL` - Base URL for backend API (e.g. `http://localhost:5500/api`)

## Project Structure
```
dishDiary/
  frontend/   # Vite React app
  server/     # Express/MongoDB backend
```

## Scripts
- **Frontend**
  - `npm run dev` — Start Vite dev server
  - `npm run build` — Build for production
- **Backend**
  - `npm run dev` — Start backend with nodemon
  - `npm start` — Start backend

## License
MIT

---

*Created with ❤️ for food lovers.*
