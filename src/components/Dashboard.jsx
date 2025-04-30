// src/components/Dashboard.jsx
import React, { useState } from 'react';
import CryptoTable from './CryptoTable';
import SearchBar from './SearchBar';
import { sampleCoins } from '../data/sampleData';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCoins = sampleCoins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Crypto Dashboard</h1>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <CryptoTable coins={filteredCoins} />
    </div>
  );
}
