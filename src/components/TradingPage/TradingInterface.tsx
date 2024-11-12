import React, { useState } from 'react';
import TradeInterface from './TradingInterface/TradeInterface';
import LiquidityInterface from './TradingInterface/LiquidityInterface';
import TokenizeInterface from './TradingInterface/TokenizeInterface';

type Tab = 'trade' | 'liquidity' | 'tokenize';

export default function TradingInterface() {
  const [activeTab, setActiveTab] = useState<Tab>('trade');

  return (
    <div className="bg-gray-800/30 rounded-lg h-[500px] lg:h-[700px]">
      <div className="flex overflow-x-auto">
        <button
          onClick={() => setActiveTab('trade')}
          className={`flex-1 px-3 lg:px-6 py-3 lg:py-4 text-sm font-medium transition-colors relative whitespace-nowrap
            ${activeTab === 'trade'
              ? 'bg-gray-900/50 text-white'
              : 'bg-transparent text-gray-400 hover:text-white'
            }
          `}
        >
          Trade
          {activeTab === 'trade' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('liquidity')}
          className={`flex-1 px-3 lg:px-6 py-3 lg:py-4 text-sm font-medium transition-colors relative whitespace-nowrap
            ${activeTab === 'liquidity'
              ? 'bg-gray-900/50 text-white'
              : 'bg-transparent text-gray-400 hover:text-white'
            }
          `}
        >
          Liquidity
          {activeTab === 'liquidity' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('tokenize')}
          className={`flex-1 px-3 lg:px-6 py-3 lg:py-4 text-sm font-medium transition-colors relative whitespace-nowrap
            ${activeTab === 'tokenize'
              ? 'bg-gray-900/50 text-white'
              : 'bg-transparent text-gray-400 hover:text-white'
            }
          `}
        >
          Tokenize
          {activeTab === 'tokenize' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      <div className="p-4 lg:p-6 h-[calc(100%-49px)] overflow-y-auto">
        {activeTab === 'trade' && <TradeInterface />}
        {activeTab === 'liquidity' && <LiquidityInterface />}
        {activeTab === 'tokenize' && <TokenizeInterface />}
      </div>
    </div>
  );
}