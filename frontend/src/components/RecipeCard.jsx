// RecipeCard component for displaying a recipe in card style
import './RecipeCard.css';

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.imageUrl || '/default-recipe.jpg'} alt={recipe.title} className="recipe-card-img" />
      <div className="recipe-card-content">
        <h3>{recipe.title}</h3>
        <p className="recipe-card-author">{recipe.author ? `By ${recipe.author}` : ''}</p>
        {/* Add rating, time, etc. here if available */}
      </div>
    </div>
  );
}
