// RecipeDetailView component for showing recipe details (skeleton)
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Timer, Star, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EditRecipeModal({ open, onClose, recipe, onSave }) {
  const [form, setForm] = useState({
    title: recipe.title || '',
    duration: recipe.duration || '',
    ingredients: (recipe.ingredients || []).join('\n'),
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions || '',
    image: null,
  });
  const [preview, setPreview] = useState(recipe.imageUrl || '/default-recipe.jpg');
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setForm(f => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    let data;
    let isMultipart = false;
    if (form.image) {
      // If image is being updated, use FormData
      data = new FormData();
      data.append('title', form.title);
      data.append('duration', form.duration);
      data.append('ingredients', form.ingredients);
      data.append('instructions', form.instructions);
      data.append('image', form.image);
      isMultipart = true;
    } else {
      // Otherwise, send JSON
      data = JSON.stringify({
        title: form.title,
        duration: form.duration,
        // Split ingredients and instructions into arrays by line
        ingredients: form.ingredients.split('\n').map(i => i.trim()).filter(Boolean),
        instructions: form.instructions.split('\n').map(i => i.trim()).filter(Boolean),
      });
    }
    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${recipe._id}`, {
        method: 'PUT',
        headers: isMultipart ? undefined : { 'Content-Type': 'application/json' },
        body: data,
      });
      if (!res.ok) throw new Error('Failed to update recipe');
      const updated = await res.json();
      onSave(updated);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2  text-2xl font-bold bg-transparent border-none p-0 m-0  focus:outline-none cursor-pointer"
          onClick={onClose}
          aria-label="Close"
          type="button"
          style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none' }}
        >
          x
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Rezept Editieren</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold">Titel
            <input name="title" className="block w-full border rounded p-2 mt-1" value={form.title} onChange={handleChange} required />
          </label>
          <label className="font-semibold">Bild
            <input type="file" name="image" accept="image/*" className="block w-full mt-1" onChange={handleChange} />
            <img src={preview} alt="Preview" className="mt-2 rounded h-32 object-cover" />
          </label>
          <label className="font-semibold">Zubereitungszeit (Minuten)
            <input name="duration" type="number" min="1" className="block w-full border rounded p-2 mt-1" value={form.duration} onChange={handleChange} required />
          </label>
          <label className="font-semibold">Zutaten
            <textarea name="ingredients" className="block w-full border rounded p-2 mt-1" value={form.ingredients} onChange={handleChange} required rows={4} />
          </label>
          <label className="font-semibold">Anleitung
            <textarea name="instructions" className="block w-full border rounded p-2 mt-1" value={form.instructions} onChange={handleChange} required rows={5} />
          </label>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Wird gespeichert...' : 'Änderungen Speichern'}
          </Button>
        </form>
      </div>
    </div>
  );
}

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
            <img
              src={recipe.imageUrl || '/default-recipe.jpg'}
              alt={recipe.title}
              className="rounded-xl w-full h-64 object-cover cursor-zoom-in"
              style={{ maxWidth: 350 }}
              onClick={() => setImageModalOpen(true)}
            />
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
              {/* Utensils icon and count centered below */}
              <div className="flex flex-col items-center mt-2">
                <button
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600 focus:outline-none"
                  onClick={() => setArchivePopupOpen(true)}
                  type="button"
                  title="Zubereitungshistorie anzeigen"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Utensils className="w-5 h-5" />
                  <span className="font-semibold">{archiveDates.length}</span>
                </button>
                {/* Archive popup */}
                {archivePopupOpen && (
                  <div
                    className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[220px] max-w-xs"
                    style={{ left: '50%', transform: 'translateX(-50%)', top: '3.5rem' }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Zubereitet am:</span>
                      <button
                        className="text-gray-400 hover:text-red-500 text-lg font-bold"
                        onClick={() => setArchivePopupOpen(false)}
                        aria-label="Schließen"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                    {archiveDates.length === 0 ? (
                      <div className="text-gray-500 text-sm">Noch nie zubereitet</div>
                    ) : (
                      <ul className="max-h-40 overflow-y-auto text-sm">
                        {archiveDates.map((d, i) => (
                          <li key={i} className="py-1 border-b last:border-b-0">
                            {format(new Date(d), 'dd.MM.yyyy')}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-4">
              Zutaten für
              <span className="flex items-center gap-2 ml-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded w-8 h-8 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  onClick={() => setPortion(p => Math.max(1, p - 1))}
                  aria-label="Decrease portion"
                  type="button"
                >
                  -
                </button>
                <span className="min-w-[2ch] text-center">{portion}</span>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded w-8 h-8 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  onClick={() => setPortion(p => p + 1)}
                  aria-label="Increase portion"
                  type="button"
                >
                  +
                </button>
                <span className="ml-1 text-sm text-gray-500">Portion{portion > 1 ? 'en' : ''}</span>
              </span>
            </h3>
            <ul className="list-disc list-inside mb-4 text-left">
              {recipe.ingredients.map((ing, i) => {
                // Improved regex: match amount (number or fraction), optional unit (with spaces, parentheses, etc.), then ' - ', then name
                // e.g. 0.25 Dose(n) (à 425 ml) - Kichererbsen
                //      0.25 Blumenkohl (ca. 250g) - Blumenkohl
                //      100 g - Möhren
                const match = ing.match(/^\s*([\d.,\/]+)\s*([^\-]*)-\s*(.+)$/);
                if (match) {
                  let amount = match[1].trim();
                  let unit = match[2] ? match[2].trim() : '';
                  const name = match[3];
                  // Try to parse amount as a number (support fractions)
                  let num = parseFloat(amount.replace(',', '.'));
                  if (!isNaN(num)) {
                    // If original was a fraction (e.g. 1/2), handle it
                    if (amount.includes('/')) {
                      const [numerator, denominator] = amount.split('/').map(Number);
                      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                        num = numerator / denominator;
                      }
                    }
                    const newAmount = (num * portion).toLocaleString(undefined, { maximumFractionDigits: 2 });
                    return (
                      <li key={i}>
                        <span className="font-semibold">
                          {newAmount}{unit ? ' ' + unit : ''}
                        </span> - {name}
                      </li>
                    );
                  }
                }
                // If no amount or can't parse, just show as is
                return <li key={i}>{ing}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Anleitung</h3>
          <ol className="list-decimal list-inside space-y-2 text-left [&>li]:pl-2">
            {Array.isArray(recipe.instructions)
              ? recipe.instructions.map((step, i) => (
                  <li key={i} className="[&::marker]:font-bold">
                    {step}
                  </li>
                ))
              : <li className="[&::marker]:font-bold">{recipe.instructions}</li>}
          </ol>
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
      {imageModalOpen && (
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/70 transition-colors duration-300 animate-fade-in" onClick={() => setImageModalOpen(false)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img
              src={recipe.imageUrl || '/default-recipe.jpg'}
              alt={recipe.title}
              className="rounded-2xl shadow-2xl max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-500 scale-100 animate-zoom-in"
              style={{ background: '#f4f4f4' }}
            />
            <button
              className="absolute top-2 right-2 flex items-center justify-center text-gray-800 text-xl font-bold bg-white rounded-full w-10 h-10 p-0 m-0 shadow hover:bg-gray-200 transition cursor-pointer"
              onClick={() => setImageModalOpen(false)}
              aria-label="Close image preview"
              type="button"
              style={{ background: 'white' }}
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
