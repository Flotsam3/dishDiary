// RecipeDetailView component for showing recipe details (skeleton)
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Timer, Star, Info } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import EditRecipeModal from "./EditRecipeModal";
import RecipeImagePreview from "./RecipeImagePreview";
import RecipeIngredientsList from "./RecipeIngredientsList";
import RecipeInstructions from "./RecipeInstructions";
import PreparationHistoryPopup from "./PreparationHistoryPopup";
import PortionSelector from "./PortionSelector";
import RecipePrintView from "./RecipePrintView";
import DescriptionModal from "./DescriptionModal";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RecipeDetailView({ id }) {
   const { user } = useAuth();
   const [recipe, setRecipe] = useState(null);
   const [date, setDate] = useState(new Date());
   const [isEditing, setIsEditing] = useState(false);
   const [rating, setRating] = useState(0);
   const [portion, setPortion] = useState(recipe?.portion || 1);
   const [commentModalOpen, setCommentModalOpen] = useState(false);
   const [comment, setComment] = useState("");
   const [imageModalOpen, setImageModalOpen] = useState(false);
   const [archiveDates, setArchiveDates] = useState([]);
   const [archivePopupOpen, setArchivePopupOpen] = useState(false);
   const [descModalOpen, setDescModalOpen] = useState(false);
   const [descEditMode, setDescEditMode] = useState(false);
   const [descValue, setDescValue] = useState("");

   useEffect(() => {
      fetch(`${API_BASE_URL}/recipes/${id}`)
         .then((res) => res.json())
         .then((data) => {
            setRecipe(data);
            setPortion(data.portion || 1);
            setDescValue(data.description || "");
         });
      // Fetch archive entries for this recipe
      fetch(`${API_BASE_URL}/archives`, {
         credentials: "include",
      })
         .then((res) => res.json())
         .then((data) => {
            // Filter for this recipe and sort by cookedAt descending
            const filtered = (data || []).filter((a) => a.recipeId === id);
            const sorted = filtered.sort((a, b) => new Date(b.cookedAt) - new Date(a.cookedAt));
            setArchiveDates(sorted.map((entry) => entry.cookedAt));
         })
         .catch((err) => {
            console.error("Error fetching archives:", err);
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
         console.log("Archiving recipe with data:", archiveData);
         const res = await fetch(`${API_BASE_URL}/archives`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(archiveData),
            credentials: "include",
         });
         console.log("Archive response status:", res.status);

         if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Archivieren fehlgeschlagen");
         }

         const savedArchive = await res.json();
         console.log("Saved archive:", savedArchive);

         toast.success("Rezept wurde archiviert!");
         setComment("");

         // Refresh archive dates
         const archivesRes = await fetch(`${API_BASE_URL}/archives`, {
            credentials: "include",
         });
         if (archivesRes.ok) {
            const archives = await archivesRes.json();
            const filtered = archives.filter((a) => a.recipeId === recipe._id);
            const sorted = filtered.sort((a, b) => new Date(b.cookedAt) - new Date(a.cookedAt));
            setArchiveDates(sorted.map((entry) => entry.cookedAt));
         }
      } catch (err) {
         console.error("Error archiving recipe:", err);
         toast.error("Fehler: " + err.message);
      }
   }

   if (!recipe) return <div>Wird geladen...</div>;

   return (
      <div className="flex flex-col items-center justify-center mt-10">
         <EditRecipeModal
            open={isEditing}
            onClose={() => setIsEditing(false)}
            recipe={recipe}
            onSave={handleSave}
         />
         <Card className="w-full max-w-3xl p-6 shadow-lg flex flex-col mt-12">
            <h2 className="text-3xl font-bold text-center py-1 mb-6 bg-amber-500 text-white rounded-sm">
               {recipe.title}
            </h2>
            <div className="flex flex-col md:flex-row gap-8 mb-6">
               <div className="flex-shrink-0 w-full md:w-1/2 flex flex-col items-center justify-start">
                  <RecipeImagePreview imageUrl={recipe.imageUrl} title={recipe.title} />
                  {/* Stars and preparation info moved here */}
                  <div className="flex flex-col items-center mt-4 relative">
                     <div className="flex items-center gap-2 justify-center">
                        {[...Array(5)].map((_, i) => (
                           <Star
                              key={i}
                              className={`w-5 h-5 cursor-pointer ${
                                 i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                              fill={i < rating ? "currentColor" : "none"}
                              strokeWidth={2}
                              onClick={() => setRating(i + 1)}
                           />
                        ))}
                        <Timer className="w-5 h-5 ml-2 text-gray-600" />
                        <span className="ml-1 text-gray-600">{recipe.duration} Min</span>
                        <Info
                           className="w-5 h-5 ml-2 text-gray-600 cursor-pointer"
                           onClick={() => setDescModalOpen(true)}
                        />
                     </div>
                     {/* Preparation history popup */}
                     <PreparationHistoryPopup
                        archiveDates={archiveDates}
                        open={archivePopupOpen}
                        setOpen={setArchivePopupOpen}
                     />
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
            <div className="flex justify-center mt-6 gap-4">
               {/* Conditionally render the Editieren button */}
               {user && recipe.userId === user.id && (
                  <button
                     className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
                     onClick={() => setIsEditing(true)}
                     type="button"
                  >
                     Editieren
                  </button>
               )}
               <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
                  onClick={() => window.print()}
                  type="button"
               >
                  Drucken
               </button>
            </div>
         </Card>
         <h2 className="mt-4 text-2xl">Als Zubereitet archivieren</h2>
         <div className="flex flex-col items-center justify-center gap-4 mt-6 mb-5">
            <div className="flex gap-3">
               {/* shadcn/ui date picker */}
               <input
                  type="date"
                  className="border rounded px-3 py-2 text-gray-700"
                  value={format(date, "yyyy-MM-dd")}
                  onChange={(e) => setDate(new Date(e.target.value))}
               />
               <button
                  className="hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
                  onClick={() => setCommentModalOpen(true)}
               >
                  Kommentar
               </button>
            </div>
            <button
               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
               onClick={handleArchive}
            >
               Zubereitet
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
                     style={{
                        background: "none",
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                     }}
                  >
                     x
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-center">Kommentar hinzufügen</h2>
                  <textarea
                     className="block w-full border rounded p-2 mb-4"
                     rows={4}
                     placeholder="Kommentar zum Archiv-Eintrag..."
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
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
                        onClick={() => {
                           handleArchive();
                           setCommentModalOpen(false);
                        }}
                        type="button"
                     >
                        Speichern
                     </button>
                  </div>
               </div>
            </div>
         )}
         <DescriptionModal
            open={descModalOpen}
            editMode={descEditMode}
            value={descValue}
            setValue={setDescValue}
            onClose={() => {
               setDescModalOpen(false);
               setDescEditMode(false);
            }}
            onEditToggle={() => setDescEditMode((e) => !e)}
            onSave={async () => {
               try {
                  const res = await fetch(`${API_BASE_URL}/recipes/${recipe._id}`, {
                     method: "PUT",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ description: descValue }),
                  });
                  if (!res.ok) throw new Error("Fehler beim Speichern");
                  const updated = await res.json();
                  setRecipe(updated);
                  setDescEditMode(false);
                  toast.success("Beschreibung gespeichert!");
               } catch (err) {
                  toast.error("Fehler: " + err.message);
               }
            }}
         />
         {/* Print area: hidden except for print, minimal layout */}
         <RecipePrintView recipe={recipe} portion={portion} />
         <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print\:block { display: block !important; }
          .print\:mb-2 { margin-bottom: 0.5rem !important; }
          .print\:mb-1 { margin-bottom: 0.25rem !important; }
          .print\:text-center { text-align: center !important; }
          .print\:p-0 { padding: 0 !important; }
          .print\:m-0 { margin: 0 !important; }
          .print\:w-full { width: 100% !important; }
          .print\:max-w-full { max-width: 100% !important; }
          .print\:shadow-none { box-shadow: none !important; }
          .print\:rounded-none { border-radius: 0 !important; }
          .print\:columns-2 { columns: 2 !important; -webkit-columns: 2 !important; -moz-columns: 2 !important; }
          .print\:gap-8 { column-gap: 2rem !important; }
        }
        @page {
          margin: 0.75cm 1.5cm 1.5cm 1.5cm;
        }
      `}</style>
      </div>
   );
}
