// FeatureImage component for homepage hero section
import './FeatureImage.css';

export default function FeatureImage({ recipes = [] }) {
  return (
    <>
      <div className="feature-image-hero">
        <img src="/feature.jpg" alt="Dish Diary Feature" />
        <div className="feature-overlay">
          <h1 className="feature-title">Dish Diary</h1>
          <p className="feature-subtitle">Dein persönlicher Rezept-Manager und Koch-Archiv</p>
        </div>
      </div>
      <h2
        className="text-2xl font-bold text-center p-5 mt-5"
        style={{ background: 'linear-gradient(135deg, #b7c7d1 0%, #c7d6df 100%)', color: '#23404a' }}
      >
        Rezept des Tages
      </h2>
      <div className="w-full flex justify-center items-center mt-6">
        <div className="w-[90vw] max-w-3xl mb-5">
          {recipes.length > 0 ? (
            (() => {
              const randomIndex = Math.floor(Math.random() * recipes.length);
              const recipe = recipes[randomIndex];
              return (
                <figure className="relative">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <figcaption className="absolute bottom-0 left-0 w-full text-center text-lg font-semibold text-gray-700 bg-white/60 rounded-b-xl p-2 backdrop-blur-sm">
                    {recipe.title}
                  </figcaption>
                </figure>
              );
            })()
          ) : (
            <figure className="relative">
              <img src="/feature.jpg" alt="Soup" className="w-full h-64 object-cover rounded-xl" />
              <figcaption className="absolute bottom-0 left-0 w-full text-center text-lg font-semibold text-gray-700 bg-white/60 rounded-b-xl p-2 backdrop-blur-sm">
                Rezept des Tages
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </>
  );
}
