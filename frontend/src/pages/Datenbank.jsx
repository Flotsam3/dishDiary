// Datenbank page for browsing all public recipes
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import SearchBar from '../components/SearchBar';
import { Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Datenbank() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const [sortBy, setSortBy] = useState('alphabetical');
  const navigate = useNavigate();

  useEffect(() => {
    // Use /recipes/public endpoint to get only public recipes
    fetch(`${API_BASE_URL}/recipes/public`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setAllRecipes(data);
        setRecipes(data);
      })
      .catch(err => {
        console.error('Error fetching public recipes:', err);
      });
  }, []);

  // Filter recipes by title or ingredients
  const handleSearch = (searchTerm) => {
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

  // Sorting logic
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title, 'de');
    } else if (sortBy === 'frequency') {
      return (b.cooked?.length || 0) - (a.cooked?.length || 0);
    } else if (sortBy === 'lastCooked') {
      const lastA = a.cooked?.length ? new Date(a.cooked[a.cooked.length - 1]) : new Date(0);
      const lastB = b.cooked?.length ? new Date(b.cooked[b.cooked.length - 1]) : new Date(0);
      return lastB - lastA;
    }
    return 0;
  });

  return (
    <div className="flex flex-col items-center max-w-7xl mx-auto mt-10 px-4 py-8">
      <div className="text-center text-base sm:text-lg font-medium mb-4">
        Es sind {allRecipes.length} öffentliche Rezepte in der Datenbank
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full items-stretch">
        <div className="flex-1 w-full">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
          />
        </div>
        {/* <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border rounded min-w-[180px] h-12 px-3 text-base focus:outline-amber-500"
        >
          <option value="alphabetical">Alphabetisch (A-Z)</option>
          <option value="frequency">Häufigkeit (meist gekocht)</option>
          <option value="lastCooked">Zuletzt gekocht</option>
        </select> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedRecipes.map(recipe => {
          const cookedArr = recipe.cooked || [];
          const lastCooked = cookedArr.length > 0
            ? new Date(cookedArr[cookedArr.length - 1]).toLocaleDateString()
            : "niemals";
          return (
            <Card
              key={recipe._id}
              className="flex flex-col items-center p-4 max-w-[300px] lg:max-w-none cursor-pointer hover:outline-amber-500 hover:outline-4 transition duration-200"
              onClick={() => navigate(`/recipe/${recipe._id}`)}
            >
              {/* <div className="flex items-center mb-2">
                <Utensils className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">{lastCooked}</span>
              </div> */}
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