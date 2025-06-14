export default function PortionSelector({ portion, setPortion }) {
  return (
    <span className="flex items-center gap-2 ml-2">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded w-8 h-8 flex items-center justify-center transition-colors duration-200 cursor-pointer"
        onClick={() => setPortion(p => Math.max(1, p - 1))}
        aria-label="Decrease portion"
        type="button"
      >
        -
      </button>
      <span className="min-w-[2ch] text-center">{portion}</span>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded w-8 h-8 flex items-center justify-center transition-colors duration-200 cursor-pointer"
        onClick={() => setPortion(p => p + 1)}
        aria-label="Increase portion"
        type="button"
      >
        +
      </button>
      <span className="ml-1 text-sm text-gray-500">Portion{portion > 1 ? 'en' : ''}</span>
    </span>
  );
}
