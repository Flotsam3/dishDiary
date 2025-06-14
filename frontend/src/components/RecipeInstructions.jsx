export default function RecipeInstructions({ instructions }) {
  return (
    <ol className="list-decimal list-inside space-y-2 text-left [&>li]:pl-2">
      {Array.isArray(instructions)
        ? instructions.map((step, i) => (
            <li key={i} className="[&::marker]:font-bold">
              {step}
            </li>
          ))
        : <li className="[&::marker]:font-bold">{instructions}</li>}
    </ol>
  );
}
