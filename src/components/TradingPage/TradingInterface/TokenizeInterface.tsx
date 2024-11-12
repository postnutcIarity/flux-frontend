import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useRadixDappToolkit } from '../../../hooks/useRadixDappToolkit';

export default function TokenizeInterface() {
  const { isConnected } = useRadixDappToolkit();
  const [inputAmount, setInputAmount] = useState('');
  const [ptOutput, setPtOutput] = useState('0.0');
  const [ytOutput, setYtOutput] = useState('0.0');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectClick = () => {
    const connectButton = document.querySelector('radix-connect-button button') as HTMLButtonElement;
    if (connectButton) {
      connectButton.click();
    }
  };

  const handleTokenize = async () => {
    if (!isConnected) {
      handleConnectClick();
      return;
    }

    if (!inputAmount) return;
    setIsLoading(true);

    try {
      // Tokenize logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated transaction
      
      // Update output amounts (1:1 ratio in this example)
      setPtOutput(inputAmount);
      setYtOutput(inputAmount);
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
          <Calculator className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Amount to Tokenize</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">USD0++</span>
              <input
                type="number"
                placeholder="0.0"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none w-1/2"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {isConnected ? 'Loading...' : '0.00'}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">PT Output Amount</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">PT-USD0++</span>
              <input
                type="number"
                placeholder="0.0"
                value={ptOutput}
                readOnly
                className="bg-transparent text-right text-lg focus:outline-none w-1/2 cursor-not-allowed opacity-75"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {isConnected ? 'Loading...' : '0.00'}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">YT Output Amount</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">YT-USD0++</span>
              <input
                type="number"
                placeholder="0.0"
                value={ytOutput}
                readOnly
                className="bg-transparent text-right text-lg focus:outline-none w-1/2 cursor-not-allowed opacity-75"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {isConnected ? 'Loading...' : '0.00'}
            </div>
          </div>
        </div>

        <button
          onClick={handleTokenize}
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
            : 'Tokenize'}
        </button>

        {isConnected && (
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span>1 USD0++ = 1 PT-USD0++ + 1 YT-USD0++</span>
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