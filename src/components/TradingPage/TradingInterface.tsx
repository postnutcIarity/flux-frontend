import React, { useState } from 'react';
import { Calculator, ArrowDownUp } from 'lucide-react';
import { useRadixDappToolkit } from '../../hooks/useRadixDappToolkit';

export default function TradingInterface() {
  const { isConnected, account } = useRadixDappToolkit();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payToken, setPayToken] = useState('XRD');
  const [receiveToken, setReceiveToken] = useState('USD0++');

  const handleSwapTokens = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  const handleConnectClick = () => {
    const connectButton = document.querySelector('radix-connect-button button') as HTMLButtonElement;
    if (connectButton) {
      connectButton.click();
    }
  };

  const handleTrade = async () => {
    if (!isConnected) {
      handleConnectClick();
      return;
    }

    if (!inputAmount) return;
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

  return (
    <div className="bg-gray-800/30 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 rounded-lg">Swap</button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            Add Liquidity
          </button>
        </div>
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
                <option value="XRD">XRD</option>
                <option value="USD0++">USD0++</option>
              </select>
              <input
                type="number"
                placeholder="0.0"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none w-1/2"
                disabled={!isConnected}
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {isConnected ? 'Loading...' : '0.00'}
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <button 
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            onClick={handleSwapTokens}
            disabled={!isConnected}
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
                <option value="USD0++">USD0++</option>
                <option value="XRD">XRD</option>
              </select>
              <input
                type="number"
                placeholder="0.0"
                value={outputAmount}
                onChange={(e) => setOutputAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none w-1/2"
                disabled={!isConnected}
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {isConnected ? 'Loading...' : '0.00'}
            </div>
          </div>
        </div>

        <button
          onClick={handleTrade}
          className={`w-full py-4 rounded-lg font-semibold transition-colors ${
            isConnected
              ? isLoading
                ? 'bg-blue-600 cursor-wait'
                : 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
          }`}
        >
          {!isConnected
            ? 'Connect Wallet'
            : isLoading
            ? 'Processing...'
            : 'Swap'}
        </button>

        {isConnected && (
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span>1 {payToken} = {payToken === 'XRD' ? '0.0234' : '42.735'} {receiveToken}</span>
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