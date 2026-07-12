// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import CryptoTable from './CryptoTable';
import SearchBar from './SearchBar';
import { sampleCoins } from '../data/sampleData';

const API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [coins, setCoins] = useState(sampleCoins);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    async function loadCoins() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setCoins(data);
          setStatus('live');
        }
      } catch {
        // offline or rate-limited — fall back to bundled sample data
        if (!cancelled) setStatus('sample');
      }
    }

    loadCoins();
    const interval = setInterval(loadCoins, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            status === 'live'
              ? 'bg-green-100 text-green-700'
              : status === 'loading'
                ? 'bg-gray-100 text-gray-500'
                : 'bg-amber-100 text-amber-700'
          }`}
        >
          {status === 'live' ? '● live — refreshes every 60s' : status === 'loading' ? 'loading…' : 'offline sample data'}
        </span>
      </div>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <CryptoTable coins={filteredCoins} />
    </div>
  );
}
