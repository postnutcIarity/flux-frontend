import React, { useState } from 'react';
import { Calculator, ArrowDownUp } from 'lucide-react';
import { useFungibleTokenValue } from '../../../hooks/useFungibleTokenValue';
import { MARKET_RESOURCES } from '../../../config/addresses';
import { useConnectButtonState } from '../../../hooks/useConnectButtonState';

export default function TradeInterface() {
  const connectButtonState = useConnectButtonState();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payToken, setPayToken] = useState('PT');
  const [receiveToken, setReceiveToken] = useState('LSU');

  // Get token balances
  const ptBalance = useFungibleTokenValue(MARKET_RESOURCES.PT);
  const lsuBalance = useFungibleTokenValue(MARKET_RESOURCES.LSU);

  const getBalance = (token: string) => {
    switch (token) {
      case 'PT':
        return ptBalance || '0';
      case 'LSU':
        return lsuBalance || '0';
      default:
        return '0';
    }
  };

  const handleSwapTokens = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  const handleTrade = async () => {
    if (connectButtonState !== 'success' || !inputAmount) return;
    setIsLoading(true);

    try {
      // Trading logic here
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

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm text-gray-400 mb-2">You Pay</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <select 
                className="bg-transparent text-lg focus:outline-none"
                value={payToken}
                onChange={(e) => setPayToken(e.target.value)}
              >
                <option value="PT">PT</option>
                <option value="LSU">LSU</option>
              </select>
              <input
                type="number"
                placeholder="0.0"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none w-1/2"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {getBalance(payToken)}
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <button 
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            onClick={handleSwapTokens}
          >
            <ArrowDownUp className="h-4 w-4" />
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">You Receive</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <select 
                className="bg-transparent text-lg focus:outline-none"
                value={receiveToken}
                onChange={(e) => setReceiveToken(e.target.value)}
              >
                <option value="LSU">LSU</option>
                <option value="PT">PT</option>
              </select>
              <input
                type="number"
                placeholder="0.0"
                value={outputAmount}
                onChange={(e) => setOutputAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none w-1/2"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {getBalance(receiveToken)}
            </div>
          </div>
        </div>

        <button
          onClick={handleTrade}
          disabled={!isConnected || isLoading}
          className={`w-full py-4 rounded-lg font-semibold transition-colors ${
            isConnected
              ? isLoading
                ? 'bg-blue-600 cursor-wait'
                : 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isConnected ? (isLoading ? 'Processing...' : 'Swap') : 'Connect Wallet'}
        </button>

        {isConnected && (
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span>1 {payToken} = {payToken === 'PT' ? '0.9234' : '1.0825'} {receiveToken}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price Impact</span>
              <span className="text-green-400">{'<0.01%'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Network Fee</span>
              <span>~0.01 XRD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
