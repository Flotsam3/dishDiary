// Home page with feature image and random recipe cards
import { useEffect, useState } from 'react';
import FeatureImage from '../components/FeatureImage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/recipes`)
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  // Only use recipes with a real image (not default)
  const recipesWithImages = recipes.filter(
    r => r.imageUrl && !r.imageUrl.includes('/default-recipe.jpg')
  );

  return (
    <div>
      <FeatureImage recipes={recipesWithImages} />
    </div>
  );
}
