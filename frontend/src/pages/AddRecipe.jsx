import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function AddRecipe() {
  const [form, setForm] = useState({
    title: "",
    image: null,
    duration: "",
    ingredients: "",
    instructions: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("duration", form.duration);
    data.append("ingredients", form.ingredients);
    data.append("instructions", form.instructions);
    if (form.image) data.append("image", form.image);

    try {
      const res = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Failed to add recipe");
      alert("Recipe submitted!");
      setForm({
        title: "",
        image: null,
        duration: "",
        ingredients: "",
        instructions: ""
      });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-xl mt-12 p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Neues Rezept Hinzufügen</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-left font-semibold">Titel
            <input
              name="title"
              className="block w-full border rounded p-2 mt-1"
              placeholder="Rezept Titel"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label className="text-left font-semibold">Bild
            <input
              type="file"
              name="image"
              accept="image/*"
              className="block w-full mt-1"
              onChange={handleChange}
            />
          </label>
          <label className="text-left font-semibold">Zubereitungszeit (Minuten)
            <input
              name="duration"
              type="number"
              min="1"
              className="block w-full border rounded p-2 mt-1"
              placeholder="z.B. 30"
              value={form.duration}
              onChange={handleChange}
              required
            />
          </label>
          <label className="text-left font-semibold">Zutaten
            <textarea
              name="ingredients"
              className="block w-full border rounded p-2 mt-1"
              placeholder="Zutaten auflisten, eine pro Zeile"
              value={form.ingredients}
              onChange={handleChange}
              required
              rows={4}
            />
          </label>
          <label className="text-left font-semibold">Anleitung
            <textarea
              name="instructions"
              className="block w-full border rounded p-2 mt-1"
              placeholder="Schritte zur Zubereitung auflisten, eine pro Zeile"
              value={form.instructions}
              onChange={handleChange}
              required
              rows={5}
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Wird abgeschickt..." : "Rezept hinzufügen"}
          </button>
        </form>
      </Card>
    </div>
  );
}
