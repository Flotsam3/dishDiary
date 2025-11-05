import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditRecipeModal({ open, onClose, recipe, onSave }) {
   const [form, setForm] = useState({
      title: recipe.title || "",
      duration: recipe.duration || "",
      portion: recipe.portion || 1,
      ingredients: (recipe.ingredients || []).join("\n"),
      instructions: Array.isArray(recipe.instructions)
         ? recipe.instructions.join("\n")
         : recipe.instructions || "",
      image: null,
      isPublic: recipe.isPublic ?? true,
   });
   const [preview, setPreview] = useState(recipe.imageUrl || "/default-recipe.jpg");
   const [saving, setSaving] = useState(false);

   function handleChange(e) {
      const { name, value, files, type, checked } = e.target;
      if (name === "image" && files && files[0]) {
         setForm((f) => ({ ...f, image: files[0] }));
         setPreview(URL.createObjectURL(files[0]));
      } else if (type === "checkbox") {
         setForm((f) => ({ ...f, [name]: checked }));
      } else {
         setForm((f) => ({ ...f, [name]: value }));
      }
   }

   async function handleSubmit(e) {
      e.preventDefault();
      setSaving(true);
      let data;
      let isMultipart = false;
      if (form.image) {
         data = new FormData();
         data.append("title", form.title);
         data.append("duration", form.duration);
         data.append("portion", form.portion);
         data.append("ingredients", form.ingredients);
         data.append("instructions", form.instructions);
         data.append("image", form.image);
         data.append("isPublic", form.isPublic);
         isMultipart = true;
      } else {
         data = JSON.stringify({
            title: form.title,
            duration: form.duration,
            portion: form.portion,
            ingredients: form.ingredients
               .split("\n")
               .map((i) => i.trim())
               .filter(Boolean),
            instructions: form.instructions
               .split("\n")
               .map((i) => i.trim())
               .filter(Boolean),
            isPublic: form.isPublic,
         });
      }
      try {
         const res = await fetch(`${API_BASE_URL}/recipes/${recipe._id}`, {
            method: "PUT",
            headers: isMultipart ? undefined : { "Content-Type": "application/json" },
            credentials: "include",
            body: data,
         });
         if (!res.ok) throw new Error("Failed to update recipe");
         const updated = await res.json();
         onSave(updated);
      } catch (err) {
         toast.error("Fehler: " + err.message);
      } finally {
         setSaving(false);
      }
   }

   async function handleDelete() {
      if (window.confirm("Möchtest du dieses Rezept wirklich löschen?")) {
         try {
            const res = await fetch(`${API_BASE_URL}/recipes/${recipe._id}`, {
               method: "DELETE",
            });
            if (!res.ok) throw new Error("Löschen fehlgeschlagen");
            toast.success("Rezept gelöscht!");
            window.location.href = "/search";
         } catch (err) {
            toast.error("Fehler: " + err.message);
         }
      }
   }

   if (!open) return null;
   return (
      <div className="fixed inset-0 z-5000 flex items-start justify-center bg-black/40 overflow-y-auto py-4">
         <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-4xl relative mx-4 my-auto">
            <button
               className="absolute top-2 right-2  text-2xl font-bold bg-transparent border-none p-0 m-0  focus:outline-none cursor-pointer"
               onClick={onClose}
               aria-label="Close"
               type="button"
               style={{ background: "none", border: "none", boxShadow: "none", outline: "none" }}
            >
               x
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Rezept Editieren</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
               {/* Titel */}
               <label className="w-full">
                  <span className="font-semibold block mb-1">Titel</span>
                  <input
                     name="title"
                     className="w-full border rounded p-2"
                     value={form.title}
                     onChange={handleChange}
                     required
                  />
               </label>

               {/* Bild */}
               <label className="w-full ">
                  <span className="font-semibold block mb-1">Bild</span>
                  <input
                     type="file"
                     name="image"
                     accept="image/*"
                     className="w-full text-center"
                     onChange={handleChange}
                  />
                  {preview && (
                     <div className="flex justify-center mt-2">
                        <img src={preview} alt="Preview" className="rounded h-32 object-cover" />
                     </div>
                  )}
               </label>

               {/* Zubereitungszeit & Portionen */}
               <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <label className="flex-1">
                     <span className="font-semibold block mb-1">Zubereitungszeit (Minuten)</span>
                     <input
                        name="duration"
                        type="number"
                        min="1"
                        className="w-full border rounded p-2"
                        value={form.duration}
                        onChange={handleChange}
                        required
                     />
                  </label>
                  <label className="flex-1">
                     <span className="font-semibold block mb-1">Portionen</span>
                     <input
                        name="portion"
                        type="number"
                        min="1"
                        className="w-full border rounded p-2"
                        value={form.portion}
                        onChange={handleChange}
                        required
                     />
                  </label>
               </div>

               {/* Zutaten & Anleitung */}
               <div className="flex flex-col md:flex-row gap-4 w-full">
                  <label className="flex-1">
                     <span className="font-semibold block mb-1">Zutaten</span>
                     <textarea
                        name="ingredients"
                        className="w-full border rounded p-2"
                        value={form.ingredients}
                        onChange={handleChange}
                        required
                        rows={6}
                     />
                  </label>
                  <label className="flex-1">
                     <span className="font-semibold block mb-1">Anleitung</span>
                     <textarea
                        name="instructions"
                        className="w-full border rounded p-2"
                        value={form.instructions}
                        onChange={handleChange}
                        required
                        rows={6}
                     />
                  </label>
               </div>

               {/* Public Checkbox */}
               <label className="flex items-center justify-center gap-2 font-semibold w-full">
                  <input
                     type="checkbox"
                     name="isPublic"
                     checked={form.isPublic}
                     onChange={handleChange}
                     className="w-4 h-4"
                  />
                  Öffentliches Rezept
               </label>

               {/* Buttons */}
               <div className="flex flex-col items-center gap-3 w-full mt-2">
                  <Button
                     className="w-80 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200 text-[14px]"
                     type="submit"
                     disabled={saving}
                  >
                     {saving ? "Wird gespeichert..." : "Änderungen Speichern"}
                  </Button>
                  <button
                     className="w-80 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200 text-[14px]"
                     type="button"
                     onClick={handleDelete}
                  >
                     Rezept Löschen
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
