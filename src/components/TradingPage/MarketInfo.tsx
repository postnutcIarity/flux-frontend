import React from 'react';
import { Info } from 'lucide-react';

interface MarketInfoProps {
  liquidity: string;
  volume24h: string;
  underlyingAPY: string;
  impliedAPY: string;
}

function MarketInfo({ liquidity, volume24h, underlyingAPY, impliedAPY }: MarketInfoProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-800/50 rounded-lg p-4">
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-1">Liquidity</div>
        <div className="text-lg lg:text-xl font-semibold">{liquidity}</div>
        <div className="text-sm text-red-400">-0.7212%</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-1">24h Volume</div>
        <div className="text-lg lg:text-xl font-semibold">{volume24h}</div>
        <div className="text-sm text-green-400">+7.17%</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-1">Underlying APY</div>
        <div className="text-lg lg:text-xl font-semibold">{underlyingAPY}</div>
        <div className="text-sm text-gray-400">+0%</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-1">Implied APY</div>
        <div className="text-lg lg:text-xl font-semibold">{impliedAPY}</div>
        <div className="text-sm text-green-400">+1.942%</div>
      </div>
    </div>
  );
}

export default MarketInfo;