// src/components/Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import CryptoTable from './CryptoTable';
import SearchBar from './SearchBar';
import { sampleCoins } from '../data/sampleData';

const API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1';

function formatCompact(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(n);
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [coins, setCoins] = useState(sampleCoins);
  const [status, setStatus] = useState('loading');
  const [lastUpdated, setLastUpdated] = useState(null);

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
          setLastUpdated(new Date());
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

  const filteredCoins = useMemo(
    () =>
      coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [coins, searchTerm]
  );

  const stats = useMemo(() => {
    if (!coins.length) {
      return { total: 0, marketCap: 0, avgChange: 0, gainers: 0 };
    }
    const total = coins.length;
    const marketCap = coins.reduce((sum, c) => sum + (c.market_cap || 0), 0);
    const changes = coins
      .map((c) => c.price_change_percentage_24h)
      .filter((n) => typeof n === 'number');
    const avgChange = changes.length
      ? changes.reduce((s, n) => s + n, 0) / changes.length
      : 0;
    const gainers = changes.filter((n) => n >= 0).length;
    return { total, marketCap, avgChange, gainers };
  }, [coins]);

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand to-brand-2 flex items-center justify-center shadow-lg shadow-brand/30">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 14l4-5 3 3 5-6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Crypto Dashboard</h1>
            <p className="text-xs text-muted">Top {stats.total} coins by market cap</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              status === 'live'
                ? 'border-up/30 bg-up/10 text-up'
                : status === 'loading'
                  ? 'border-border bg-surface text-muted'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === 'live'
                  ? 'bg-up live-dot'
                  : status === 'loading'
                    ? 'bg-muted animate-pulse'
                    : 'bg-amber-400'
              }`}
            />
            {status === 'live'
              ? 'Live'
              : status === 'loading'
                ? 'Loading…'
                : 'Sample data'}
          </span>
          {status === 'live' && (
            <span className="hidden sm:inline-flex text-xs text-muted px-3 py-1.5 rounded-full border border-border bg-surface">
              Updated {updatedLabel}
            </span>
          )}
        </div>
      </header>

      {/* Summary stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Total Market Cap" value={`$${formatCompact(stats.marketCap)}`} />
        <StatCard label="Coins Tracked" value={stats.total} />
        <StatCard
          label="Avg 24h Change"
          value={`${stats.avgChange >= 0 ? '+' : ''}${stats.avgChange.toFixed(2)}%`}
          tone={stats.avgChange >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Gainers / Total"
          value={`${stats.gainers} / ${stats.total}`}
        />
      </section>

      {/* Search */}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Table / empty state */}
      {filteredCoins.length ? (
        <CryptoTable coins={filteredCoins} />
      ) : (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <p className="text-sm font-medium">No coins found</p>
          <p className="text-xs text-muted mt-1">
            Try searching by name or symbol.
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-muted">
        Data from CoinGecko · Refreshes every 60s
      </footer>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-border bg-surface/70 backdrop-blur px-4 py-3.5">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`mt-1 text-lg font-bold tnum ${
          tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
