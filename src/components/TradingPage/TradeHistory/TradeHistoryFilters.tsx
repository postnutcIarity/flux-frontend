import React from 'react';
import { Search } from 'lucide-react';

interface TradeHistoryFiltersProps {
  selectedAction: string;
  setSelectedAction: (action: string) => void;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  viewType: 'trades' | 'liquidity';
  setViewType: (type: 'trades' | 'liquidity') => void;
}

export default function TradeHistoryFilters({
  selectedAction,
  setSelectedAction,
  selectedValue,
  setSelectedValue,
  viewType,
  setViewType
}: TradeHistoryFiltersProps) {
  return (
    <div className="flex flex-col space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Filter by wallet address"
            className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              {viewType === 'trades' ? (
                <>
                  <option value="long">Long Yield</option>
                  <option value="short">Short Yield</option>
                </>
              ) : (
                <>
                  <option value="add">Add Liquidity</option>
                  <option value="remove">Remove Liquidity</option>
                </>
              )}
            </select>

            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Values</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-10000">$1,000 - $10,000</option>
              <option value="10000-100000">$10,000 - $100,000</option>
              <option value="100000+">$100,000+</option>
            </select>
          </div>

          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setViewType('trades')}
              className={`px-4 py-1 rounded-md text-sm transition-colors ${
                viewType === 'trades'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Trades
            </button>
            <button
              onClick={() => setViewType('liquidity')}
              className={`px-4 py-1 rounded-md text-sm transition-colors ${
                viewType === 'liquidity'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Liquidity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}