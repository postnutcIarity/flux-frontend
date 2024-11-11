import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const markets = [
  {
    name: 'LSULP',
    maturity: '2024-06-30',
    liquidity: '$24.5M',
    longYieldAPY: '12.45%',
    fixedAPY: '10.82%',
  },
  {
    name: 'XRD',
    maturity: '2024-07-15',
    liquidity: '$18.2M',
    longYieldAPY: '15.67%',
    fixedAPY: '13.25%',
  },
  {
    name: 'USDC',
    maturity: '2024-06-30',
    liquidity: '$45.8M',
    longYieldAPY: '8.92%',
    fixedAPY: '7.65%',
  },
  {
    name: 'xBTC',
    maturity: '2024-08-01',
    liquidity: '$32.1M',
    longYieldAPY: '14.23%',
    fixedAPY: '12.48%',
  },
  {
    name: 'xETH',
    maturity: '2024-07-15',
    liquidity: '$28.7M',
    longYieldAPY: '13.85%',
    fixedAPY: '11.93%',
  },
];

function MarketsTable() {
  const navigate = useNavigate();

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
              onClick={() => navigate(`/trade/${market.name.toLowerCase()}`)}
            >
              <td className="px-6 py-4">
                <button 
                  className="text-gray-500 hover:text-yellow-500 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td className="px-6 py-4 font-medium">{market.name}</td>
              <td className="px-6 py-4 text-gray-300">{market.maturity}</td>
              <td className="px-6 py-4 text-gray-300">{market.liquidity}</td>
              <td className="px-6 py-4 text-green-400">{market.longYieldAPY}</td>
              <td className="px-6 py-4 text-blue-400">{market.fixedAPY}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarketsTable;