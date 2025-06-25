// RecipePrintView.jsx
// Print-friendly view for a recipe (for use in print media)
import React from 'react';

export default function RecipePrintView({ recipe, portion }) {
  if (!recipe) return null;
  return (
    <div id="print-area" className="hidden print:block print:p-0 print:m-0 print:bg-white print:text-black print:w-full print:max-w-full print:shadow-none print:rounded-none">
      <h1 className="text-2xl font-bold mb-4 print:mb-2 print:text-center">{recipe.title}</h1>
      <h2 className="text-lg font-semibold mb-2 print:mb-1">Zutaten für {portion} Portion{portion > 1 ? 'en' : ''}</h2>
      <ul className="mb-4 print:mb-2 list-disc list-inside print:columns-2 print:gap-8 print:text-left text-left">
        {recipe.ingredients.map((ing, i) => {
          const match = ing.match(/^\s*([\d.,\/]+)\s*([^\-]*)-\s*(.+)$/);
          if (match) {
            let amount = match[1].trim();
            let unit = match[2] ? match[2].trim() : '';
            const name = match[3];
            let num = parseFloat(amount.replace(',', '.'));
            if (!isNaN(num)) {
              if (amount.includes('/')) {
                const [numerator, denominator] = amount.split('/').map(Number);
                if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                  num = numerator / denominator;
                }
              }
              const newAmount = (num * portion).toLocaleString(undefined, { maximumFractionDigits: 2 });
              return (
                <li key={i}>
                  <span className="font-semibold">{newAmount}{unit ? ' ' + unit : ''}</span> - {name}
                </li>
              );
            }
          }
          return <li key={i}>{ing}</li>;
        })}
      </ul>
      <h2 className="text-lg font-semibold mb-2 print:mb-1">Anleitung</h2>
      <ol className="list-decimal list-inside space-y-2 text-left print:space-y-1">
        {Array.isArray(recipe.instructions)
          ? recipe.instructions.map((step, i) => (
              <li key={i} className="[&::marker]:font-bold">{step}</li>
            ))
          : <li className="[&::marker]:font-bold">{recipe.instructions}</li>}
      </ol>
    </div>
  );
}
