// src/components/CryptoTable.jsx
import React from 'react';

export default function CryptoTable({ coins }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full table-auto text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
          <tr>
            <th className="px-4 py-3">Coin</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">24h %</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                {coin.name} ({coin.symbol.toUpperCase()})
              </td>
              <td className="px-4 py-3">${coin.current_price.toLocaleString()}</td>
              <td className="px-4 py-3">${coin.market_cap.toLocaleString()}</td>
              <td
                className={`px-4 py-3 font-semibold ${
                  coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
