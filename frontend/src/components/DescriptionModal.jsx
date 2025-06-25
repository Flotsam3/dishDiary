import React from "react";

export default function DescriptionModal({
  open,
  editMode,
  value,
  setValue,
  onClose,
  onEditToggle,
  onSave
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-red-600 text-2xl font-bold bg-transparent border-none p-0 m-0 hover:text-red-700 focus:outline-none cursor-pointer"
          onClick={onClose}
          aria-label="Close"
          type="button"
          style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none' }}
        >
          x
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Rezept-Beschreibung</h2>
        {editMode ? (
          <textarea
            className="w-full border rounded p-2 mb-4 text-left"
            rows={4}
            placeholder="Beschreibung hinzufügen..."
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        ) : (
          <div className="mb-4 min-h-[3rem] whitespace-pre-line text-gray-700 text-left">{value || <span className="text-gray-400">Keine Beschreibung vorhanden.</span>}</div>
        )}
        <div className="flex justify-center gap-2 mt-4">
          {editMode ? (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded cursor-pointer"
              onClick={onSave}
              type="button"
            >
              Speichern
            </button>
          ) : null}
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded cursor-pointer"
            onClick={onEditToggle}
            type="button"
          >
            {editMode ? 'Abbrechen' : 'Bearbeiten'}
          </button>
        </div>
      </div>
    </div>
  );
}
