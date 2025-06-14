import { useState } from 'react';

export default function RecipeImagePreview({ imageUrl, title }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img
        src={imageUrl || '/default-recipe.jpg'}
        alt={title}
        className="rounded-xl w-full h-64 object-cover cursor-zoom-in"
        style={{ maxWidth: 350 }}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/70 transition-colors duration-300 animate-fade-in" onClick={() => setOpen(false)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img
              src={imageUrl || '/default-recipe.jpg'}
              alt={title}
              className="rounded-2xl shadow-2xl max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-500 scale-100 animate-zoom-in"
              style={{ background: '#f4f4f4' }}
            />
            <button
              className="absolute top-2 right-2 flex items-center justify-center text-gray-800 text-xl font-bold bg-white rounded-full w-10 h-10 p-0 m-0 shadow hover:bg-gray-200 transition cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Close image preview"
              type="button"
              style={{ background: 'white' }}
            >
              x
            </button>
          </div>
        </div>
      )}
    </>
  );
}
