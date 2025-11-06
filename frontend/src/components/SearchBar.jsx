// SearchBar component for searching recipes
export default function SearchBar({ query, setQuery, onSearch }) {
   return (
      <div className="flex flex-col gap-2 mb-3 sm:flex-row">
         <input
            type="text"
            placeholder="Suche nach Rezepten und Zutaten..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
               flex: 1,
               padding: "0.5rem",
               fontSize: "1rem",
               backgroundColor: "white",
               border: "1px solid #ccc",
               borderRadius: "0.375rem",
            }}
         />
         <div className="flex justify-center gap-3">
            <button
               type="button"
               onClick={() => onSearch(query)}
               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
            >
               Suchen
            </button>
            <button
               type="button"
               onClick={() => {
                  setQuery("");
                  onSearch("");
               }}
               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer transition-colors duration-200"
            >
               Reset
            </button>
         </div>
      </div>
   );
}
