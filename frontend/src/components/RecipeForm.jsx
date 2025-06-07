// RecipeForm component for adding a new recipe (skeleton)
import { useState } from 'react';

export default function RecipeForm() {
  const [form, setForm] = useState({ title: '', author: '', ingredients: '', instructions: '', image: null });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: handle form submit and image upload
    alert('Recipe submitted! (not yet implemented)');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
      <textarea name="ingredients" placeholder="Ingredients (comma separated)" value={form.ingredients} onChange={handleChange} required />
      <textarea name="instructions" placeholder="Instructions" value={form.instructions} onChange={handleChange} required />
      <input type="file" name="image" accept="image/*" onChange={handleChange} />
      <button type="submit">Add Recipe</button>
    </form>
  );
}
