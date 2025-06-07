// Search page for recipes
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import SearchBar from '../components/SearchBar';
import { Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Search() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/recipes`)
      .then(res => res.json())
      .then(data => {
        setAllRecipes(data);
        setRecipes(data);
      });
  }, []);

  // Filter recipes by title or ingredients
  const handleSearch = (searchTerm) => {
    // Always expect a string, not an event
    const term = typeof searchTerm === 'string' ? searchTerm : '';
    setQuery(term);
    if (!term) {
      setRecipes(allRecipes);
      return;
    }
    const lower = term.toLowerCase();
    setRecipes(
      allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(lower) ||
        (Array.isArray(recipe.ingredients) &&
          recipe.ingredients.some(ing => typeof ing === 'string' && ing.toLowerCase().includes(lower)))
      )
    );
  };

  const handleReset = () => {
    setQuery('');
    setRecipes(allRecipes);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 py-8">
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map(recipe => {
          const cookedArr = recipe.cooked || [];
          const lastCooked = cookedArr.length > 0
            ? new Date(cookedArr[cookedArr.length - 1]).toLocaleDateString()
            : "niemals";
          return (
            <Card
              key={recipe._id}
              className="flex flex-col items-center p-4 cursor-pointer hover:outline-amber-500 hover:outline-4 transition duration-200"
              onClick={() => navigate(`/recipe/${recipe._id}`)}
            >
              <div className="flex items-center mb-2">
                <Utensils className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">{lastCooked}</span>
              </div>
              <img
                src={recipe.imageUrl || '/default-recipe.jpg'}
                alt={recipe.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold text-center truncate w-full">{recipe.title}</h3>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
