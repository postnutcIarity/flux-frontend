import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useConnectButtonState } from '../../../hooks/useConnectButtonState';
import { useFungibleTokenValue } from '../../../hooks/useFungibleTokenValue';
import { MARKET_RESOURCES } from '../../../config/addresses';

export default function LiquidityInterface() {
  const connectButtonState = useConnectButtonState();
  const [firstAmount, setFirstAmount] = useState('');
  const [secondAmount, setSecondAmount] = useState('');
  const [firstToken, setFirstToken] = useState('PT');
  const [secondToken, setSecondToken] = useState('LSU');
  const [isLoading, setIsLoading] = useState(false);

  // Get token balances
  const ptBalance = useFungibleTokenValue(MARKET_RESOURCES.PT);
  const lsuBalance = useFungibleTokenValue(MARKET_RESOURCES.LSU);
  const poolUnitBalance = useFungibleTokenValue(MARKET_RESOURCES.POOL_UNIT);

  const getBalance = (token: string) => {
    switch (token) {
      case 'PT':
        return ptBalance || '0';
      case 'LSU':
        return lsuBalance || '0';
      case 'POOL_UNIT':
        return poolUnitBalance || '0';
      default:
        return '0';
    }
  };

  const handleFirstTokenChange = (newToken: string) => {
    setFirstToken(newToken);
    setSecondToken(newToken === 'PT' ? 'LSU' : 'PT');
  };

  const handleSecondTokenChange = (newToken: string) => {
    setSecondToken(newToken);
    setFirstToken(newToken === 'PT' ? 'LSU' : 'PT');
  };

  const handleAddLiquidity = async () => {
    if (connectButtonState !== 'success' || !firstAmount || !secondAmount) return;
    setIsLoading(true);

    try {
      // Add liquidity logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated transaction
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = connectButtonState === 'success';

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
          <Calculator className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">First Token</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <select 
                className="bg-transparent text-lg focus:outline-none"
                value={firstToken}
                onChange={(e) => handleFirstTokenChange(e.target.value)}
              >
                <option value="PT">PT</option>
                <option value="LSU">LSU</option>
              </select>
              <input
                type="number"
                placeholder="0.0"
                value={firstAmount}
                onChange={(e) => setFirstAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none w-1/2"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {getBalance(firstToken)}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Second Token</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <select 
                className="bg-transparent text-lg focus:outline-none"
                value={secondToken}
                onChange={(e) => handleSecondTokenChange(e.target.value)}
              >
                <option value="PT">PT</option>
                <option value="LSU">LSU</option>
              </select>
              <input
                type="number"
                placeholder="0.0"
                value={secondAmount}
                onChange={(e) => setSecondAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none w-1/2"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {getBalance(secondToken)}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">You Will Receive</label>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg">Pool Unit</span>
            <input
              type="number"
              placeholder="0.0"
              value="0.0" // This will be calculated later
              readOnly
              className="bg-transparent text-right text-lg focus:outline-none w-1/2 cursor-not-allowed"
            />
          </div>
          <div className="text-right text-sm text-gray-400 mt-1">
            Balance: {getBalance('POOL_UNIT')}
          </div>
        </div>
      </div>

      <button
        onClick={handleAddLiquidity}
        disabled={!isConnected || isLoading}
        className={`w-full py-4 rounded-lg font-semibold transition-colors ${
          isConnected
            ? isLoading
              ? 'bg-blue-600 cursor-wait'
              : 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isConnected ? (isLoading ? 'Processing...' : 'Add Liquidity') : 'Connect Wallet'}
      </button>

      {isConnected && (
        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Pool Share</span>
            <span>0.00%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Network Fee</span>
            <span>~0.01 XRD</span>
          </div>
        </div>
      )}
    </div>
  );
}