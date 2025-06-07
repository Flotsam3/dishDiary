// ArchiveList component for listing cooked recipes (skeleton)
import { Star, Info } from 'lucide-react';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ArchiveList() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/archives`)
      .then(res => res.json())
      .then(data => {
        setArchives(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Eintrag wirklich löschen?')) return;
    await fetch(`${API_BASE_URL}/archives/${id}`, { method: 'DELETE' });
    setArchives(archives => archives.filter(a => a._id !== id));
  }

  async function handleDeleteAll() {
    if (!window.confirm('Alle Einträge wirklich löschen?')) return;
    await fetch(`${API_BASE_URL}/archives`, { method: 'DELETE' });
    setArchives([]);
  }

  if (loading) return <div>Lade Archiv...</div>;

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="w-[900px] flex justify-center mb-2 mt-15">
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow cursor-pointer transition-colors duration-200"
          onClick={handleDeleteAll}
        >
          Alle löschen
        </Button>
      </div>
      <table className="w-[900px] border-collapse text-center">
        <thead>
          <tr className="bg-amber-500">
            <th className="p-2 text-center w-28 text-white">Datum</th>
            <th className="p-2 text-center w-32 text-white">Wochentag</th>
            <th className="p-2 text-center text-white" style={{ width: '60%' }}>Titel</th>
            <th className="p-2 text-center w-32 text-white">Bewertung</th>
            <th className="p-2 text-center w-20 text-white">Kommentar</th>
            <th className="p-2 text-center w-28 text-white">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {archives.map(a => {
            // Ensure stars is a number (handle string/undefined/null)
            const stars = typeof a.stars === 'number' ? a.stars : parseInt(a.stars, 10) || 0;
            return (
              <tr key={a._id} className="border-b text-center">
                <td className="p-2 align-middle">{a.cookedAt ? format(new Date(a.cookedAt), 'dd.MM.yyyy') : ''}</td>
                <td className="p-2 align-middle">{a.cookedAt ? format(new Date(a.cookedAt), 'EEEE', { locale: de }) : ''}</td>
                <td className="p-2 align-middle font-semibold" style={{ width: '60%' }}>{a.title}</td>
                <td className="p-2 align-middle">
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={i < stars ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </td>
                <td className="p-2 align-middle">
                  {a.notes && String(a.notes).trim() !== '' && (
                    <span className="relative group flex justify-center">
                      <Info className="w-4 h-4 text-gray-500 group-hover:text-amber-500 mx-auto" />
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-64 bg-white border border-gray-300 rounded shadow-lg px-3 py-2 text-sm text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-left">
                        {a.notes}
                      </span>
                    </span>
                  )}
                </td>
                <td className="p-2 align-middle">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow cursor-pointer transition-colors duration-200"
                    onClick={() => handleDelete(a._id)}
                  >
                    Löschen
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {archives.length === 0 && <div className="text-center text-gray-500 mt-6">Noch keine archivierten Rezepte.</div>}
    </div>
  );
}
