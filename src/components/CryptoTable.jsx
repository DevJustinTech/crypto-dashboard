// src/components/CryptoTable.jsx
import React, { useEffect, useRef } from 'react';

function formatUsd(n) {
  if (n == null || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  const opts =
    abs >= 1
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { minimumFractionDigits: 4, maximumFractionDigits: 6 };
  return n.toLocaleString('en-US', opts);
}

function formatCompact(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(n);
}

export default function CryptoTable({ coins }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface/70 backdrop-blur shadow-xl shadow-black/20">
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="text-xs uppercase tracking-wider text-muted bg-surface-2/60">
          <tr>
            <th className="px-4 sm:px-5 py-3.5 font-semibold w-10">#</th>
            <th className="px-4 sm:px-5 py-3.5 font-semibold">Coin</th>
            <th className="px-4 sm:px-5 py-3.5 font-semibold text-right">Price</th>
            <th className="px-4 sm:px-5 py-3.5 font-semibold text-right hidden sm:table-cell">Market Cap</th>
            <th className="px-4 sm:px-5 py-3.5 font-semibold text-right">24h %</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, i) => (
            <CoinRow key={coin.id} coin={coin} rank={i + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoinRow({ coin, rank }) {
  const change = coin.price_change_percentage_24h;
  const up = typeof change === 'number' && change >= 0;

  const priceTD = useRef(null);
  const prevPrice = useRef(coin.current_price);

  useEffect(() => {
    if (priceTD.current && coin.current_price !== prevPrice.current) {
      priceTD.current.classList.remove('flash-up', 'flash-down');
      // force reflow so the animation restarts
      void priceTD.current.offsetWidth;
      priceTD.current.classList.add(
        coin.current_price > prevPrice.current ? 'flash-up' : 'flash-down'
      );
      prevPrice.current = coin.current_price;
    }
  }, [coin.current_price]);

  return (
    <tr className="border-t border-border/70 transition-colors hover:bg-surface-2/50">
      <td className="px-4 sm:px-5 py-3.5 text-muted tnum">{rank}</td>
      <td className="px-4 sm:px-5 py-3.5">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt="" className="w-6 h-6 rounded-full bg-surface-2" loading="lazy" />
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{coin.name}</p>
            <p className="text-xs text-muted uppercase">{coin.symbol}</p>
          </div>
        </div>
      </td>
      <td ref={priceTD} className="px-4 sm:px-5 py-3.5 text-right font-semibold text-white tnum rounded-lg">
        ${formatUsd(coin.current_price)}
      </td>
      <td className="px-4 sm:px-5 py-3.5 text-right text-muted tnum hidden sm:table-cell">
        ${formatCompact(coin.market_cap)}
      </td>
      <td className="px-4 sm:px-5 py-3.5 text-right">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tnum ${
            up ? 'bg-up/10 text-up' : 'bg-down/10 text-down'
          }`}
        >
          <svg viewBox="0 0 24 24" className={`w-3 h-3 ${up ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17l5-5 3 3 5-6" />
          </svg>
          {typeof change === 'number' ? Math.abs(change).toFixed(2) : '—'}%
        </span>
      </td>
    </tr>
  );
}
