import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditRecipeModal({ open, onClose, recipe, onSave }) {
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
      data = new FormData();
      data.append('title', form.title);
      data.append('duration', form.duration);
      data.append('ingredients', form.ingredients);
      data.append('instructions', form.instructions);
      data.append('image', form.image);
      isMultipart = true;
    } else {
      data = JSON.stringify({
        title: form.title,
        duration: form.duration,
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
      toast.error('Fehler: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (window.confirm('Möchtest du dieses Rezept wirklich löschen?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/recipes/${recipe._id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Löschen fehlgeschlagen');
        toast.success('Rezept gelöscht!');
        window.location.href = '/search';
      } catch (err) {
        toast.error('Fehler: ' + err.message);
      }
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200 text-[14px]"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Wird gespeichert...' : 'Änderungen Speichern'}
          </Button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200 mt-2 text-[14px]"
            type="button"
            onClick={handleDelete}
          >
            Rezept Löschen
          </button>
        </form>
      </div>
    </div>
  );
}
