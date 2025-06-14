// RecipeDetailView component for showing recipe details (skeleton)
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Timer, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import EditRecipeModal from './EditRecipeModal';
import RecipeImagePreview from './RecipeImagePreview';
import RecipeIngredientsList from './RecipeIngredientsList';
import RecipeInstructions from './RecipeInstructions';
import PreparationHistoryPopup from './PreparationHistoryPopup';
import PortionSelector from './PortionSelector';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RecipeDetailView({ id }) {
  const [recipe, setRecipe] = useState(null);
  const [date, setDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [portion, setPortion] = useState(1);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [archiveDates, setArchiveDates] = useState([]);
  const [archivePopupOpen, setArchivePopupOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/recipes/${id}`)
      .then(res => res.json())
      .then(setRecipe);
    // Fetch archive entries for this recipe
    fetch(`${API_BASE_URL}/archives`)
      .then(res => res.json())
      .then(data => {
        // Filter for this recipe and sort by cookedAt descending
        const filtered = (data || []).filter(a => a.recipeId === id);
        const sorted = filtered.sort((a, b) => new Date(b.cookedAt) - new Date(a.cookedAt));
        setArchiveDates(sorted.map(entry => entry.cookedAt));
      });
  }, [id]);

  function handleSave(updated) {
    setRecipe(updated);
    setIsEditing(false);
  }

  // Add this function to handle archiving
  async function handleArchive() {
    const cookedAt = date;
    const archiveData = {
      recipeId: recipe._id,
      title: recipe.title,
      cookedAt,
      stars: rating > 0 ? rating : 0,
      notes: comment,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/archives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(archiveData),
      });
      if (!res.ok) throw new Error('Archivieren fehlgeschlagen');
      toast.success('Rezept wurde archiviert!');
      setComment("");
    } catch (err) {
      toast.error('Fehler: ' + err.message);
    }
  }

  if (!recipe) return <div>Wird geladen...</div>;

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <EditRecipeModal open={isEditing} onClose={() => setIsEditing(false)} recipe={recipe} onSave={handleSave} />
      <Card className="w-full max-w-3xl p-6 shadow-lg flex flex-col mt-12">
        <h2 className="text-3xl font-bold text-center py-1 mb-6 bg-amber-500 text-white rounded-sm">{recipe.title}</h2>
        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <div className="flex-shrink-0 w-full md:w-1/2 flex flex-col items-center justify-start">
            <RecipeImagePreview imageUrl={recipe.imageUrl} title={recipe.title} />
            {/* Stars and preparation info moved here */}
            <div className="flex flex-col items-center mt-4 relative">
              <div className="flex items-center gap-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 cursor-pointer ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    fill={i < rating ? 'currentColor' : 'none'}
                    strokeWidth={2}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
                <Timer className="w-5 h-5 ml-2 text-gray-600" />
                <span className="ml-1 text-gray-600">{recipe.duration} Min</span>
              </div>
              {/* Preparation history popup */}
              <PreparationHistoryPopup archiveDates={archiveDates} open={archivePopupOpen} setOpen={setArchivePopupOpen} />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-4">
              Zutaten für
              <PortionSelector portion={portion} setPortion={setPortion} />
            </h3>
            <RecipeIngredientsList ingredients={recipe.ingredients} portion={portion} />
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Anleitung</h3>
          <RecipeInstructions instructions={recipe.instructions} />
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            Editieren
          </button>
        </div>
      </Card>
      <div className="flex flex-row items-center justify-center gap-4 mt-6 mb-5">
        {/* shadcn/ui date picker */}
        <input
          type="date"
          className="border rounded px-3 py-2 text-gray-700"
          value={format(date, 'yyyy-MM-dd')}
          onChange={e => setDate(new Date(e.target.value))}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
          onClick={handleArchive}
        >
          Zubereitet
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
          onClick={() => setCommentModalOpen(true)}
        >
          Kommentar
        </button>
      </div>
      {commentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-red-600 text-2xl font-bold bg-transparent border-none p-0 m-0 hover:text-red-700 focus:outline-none cursor-pointer"
              onClick={() => setCommentModalOpen(false)}
              aria-label="Close"
              type="button"
              style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none' }}
            >
              x
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Kommentar hinzufügen</h2>
            <textarea
              className="block w-full border rounded p-2 mb-4"
              rows={4}
              placeholder="Kommentar zum Archiv-Eintrag..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex justify-center gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded cursor-pointer"
                onClick={() => setCommentModalOpen(false)}
                type="button"
              >
                Abbrechen
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded cursor-pointer"
                onClick={() => setCommentModalOpen(false)}
                type="button"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
