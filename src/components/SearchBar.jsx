// src/components/SearchBar.jsx
import React from 'react';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="relative mb-6">
      <svg
        viewBox="0 0 24 24"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>

      <input
        type="text"
        placeholder="Search by name or symbol…"
        className="w-full pl-11 pr-10 py-3 rounded-xl border border-border bg-surface/70 backdrop-blur text-white placeholder:text-muted/70 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-brand/40"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search coins"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-surface-2 text-muted hover:text-white hover:bg-border transition-colors"
          aria-label="Clear search"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
