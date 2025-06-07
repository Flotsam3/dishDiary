# Dish Diary Backend

This is the Express/MongoDB backend for the Dish Diary MERN stack app.

## Features
- Recipe CRUD (with image upload via Cloudinary)
- Archive cooked recipes
- Modern ES6+ syntax (import/export)
- MVC pattern

## Setup
1. Copy `.env` and fill in your MongoDB and Cloudinary credentials.
2. Run `npm install` in the `server` directory.
3. Start the server with `node index.js` (or use `nodemon` for development).

## API Endpoints
- `GET /api/recipes` — List all recipes
- `GET /api/recipes/:id` — Get recipe by ID
- `POST /api/recipes` — Create recipe (with image upload)
- `PUT /api/recipes/:id` — Update recipe
- `DELETE /api/recipes/:id` — Delete recipe
- `GET /api/archives` — List all cooked/archived recipes
- `POST /api/archives` — Archive a recipe
