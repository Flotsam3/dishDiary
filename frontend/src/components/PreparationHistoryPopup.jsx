import { Utensils } from 'lucide-react';
import { format } from 'date-fns';

export default function PreparationHistoryPopup({ archiveDates, open, setOpen }) {
  return (
    <div className="flex flex-col items-center mt-2">
      <button
        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 focus:outline-none"
        onClick={() => setOpen(true)}
        type="button"
        title="Zubereitungshistorie anzeigen"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <Utensils className="w-5 h-5" />
        <span className="font-semibold">{archiveDates.length}</span>
      </button>
      {open && (
        <div
          className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[220px] max-w-xs"
          style={{ left: '50%', transform: 'translateX(-50%)', top: '3.5rem' }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Zubereitet am:</span>
            <button
              className="text-gray-400 hover:text-red-500 text-lg font-bold"
              onClick={() => setOpen(false)}
              aria-label="Schließen"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          {archiveDates.length === 0 ? (
            <div className="text-gray-500 text-sm">Noch nie zubereitet</div>
          ) : (
            <ul className="max-h-40 overflow-y-auto text-sm">
              {archiveDates.map((d, i) => (
                <li key={i} className="py-1 border-b last:border-b-0">
                  {format(new Date(d), 'dd.MM.yyyy')}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
