import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMarketData } from '../hooks/useMarketData';

function MarketsTable() {
  const navigate = useNavigate();
  const { markets, loading, error } = useMarketData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-400">Loading market data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-400">Error loading market data</div>
      </div>
    );
  }

  const handleRowClick = (e: React.MouseEvent, marketName: string) => {
    // Prevent navigation if text is being selected
    if (window.getSelection()?.toString()) {
      return;
    }

    // Prevent navigation if right-clicking
    if (e.button === 2) {
      return;
    }

    navigate(`/trade/${marketName.toLowerCase()}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-6 py-3 text-left"></th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Maturity</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Liquidity</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Long Yield APY</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Fixed APY</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => (
            <tr
              key={market.name}
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
              onClick={(e) => handleRowClick(e, market.name)}
              onContextMenu={(e) => e.stopPropagation()} // Prevent context menu from triggering row click
            >
              <td className="px-6 py-4">
                <button 
                  className="text-gray-500 hover:text-yellow-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add favorite functionality here
                  }}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td className="px-6 py-4 font-medium">{market.name}</td>
              <td className="px-6 py-4 text-gray-300 select-text">{market.maturity}</td>
              <td className="px-6 py-4 text-gray-300 select-text">{market.liquidity}</td>
              <td className="px-6 py-4 text-green-400 select-text">{market.longYieldAPY}</td>
              <td className="px-6 py-4 text-blue-400 select-text">{market.fixedAPY}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarketsTable;