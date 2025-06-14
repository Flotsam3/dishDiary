export default function RecipeIngredientsList({ ingredients, portion }) {
  return (
    <ul className="list-disc list-inside mb-4 text-left">
      {ingredients.map((ing, i) => {
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
                <span className="font-semibold">
                  {newAmount}{unit ? ' ' + unit : ''}
                </span> - {name}
              </li>
            );
          }
        }
        return <li key={i}>{ing}</li>;
      })}
    </ul>
  );
}
