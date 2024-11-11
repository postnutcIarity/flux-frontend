import React from 'react';

interface Trade {
  time: string;
  action: 'Short Yield' | 'Long Yield';
  impliedAPY: string;
  value: string;
  notionalSize: string;
}

interface TradesTableProps {
  trades: Trade[];
  selectedAction: string;
  selectedValue: string;
}

export default function TradesTable({ trades, selectedAction, selectedValue }: TradesTableProps) {
  const filterTrades = (trade: Trade) => {
    const valueNum = parseFloat(trade.value.replace(/[$,]/g, ''));
    const matchesAction = selectedAction === 'all' || 
      (selectedAction === 'long' && trade.action === 'Long Yield') ||
      (selectedAction === 'short' && trade.action === 'Short Yield');
    
    const matchesValue = selectedValue === 'all' ||
      (selectedValue === '0-1000' && valueNum <= 1000) ||
      (selectedValue === '1000-10000' && valueNum > 1000 && valueNum <= 10000) ||
      (selectedValue === '10000-100000' && valueNum > 10000 && valueNum <= 100000) ||
      (selectedValue === '100000+' && valueNum > 100000);

    return matchesAction && matchesValue;
  };

  const filteredTrades = trades.filter(filterTrades);

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-800/50">
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Time</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Action</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Implied APY</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Value</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Notional Size</th>
        </tr>
      </thead>
      <tbody>
        {filteredTrades.map((trade, index) => (
          <tr
            key={index}
            className="border-t border-gray-800/50 hover:bg-gray-800/30 transition-colors"
          >
            <td className="px-6 py-4 text-sm text-gray-300">{trade.time}</td>
            <td className="px-6 py-4 text-sm">
              <span
                className={`${
                  trade.action === 'Short Yield' ? 'text-emerald-400' : 'text-blue-400'
                }`}
              >
                {trade.action}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-300">{trade.impliedAPY}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{trade.value}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{trade.notionalSize}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}