import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useRadixDappToolkit } from '../hooks/useRadixDappToolkit';
import { getRdt, buildTransactionManifest } from '../config/radix';

function TradingInterface() {
  const { isConnected, account } = useRadixDappToolkit();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');

  const handleTrade = async () => {
    if (!isConnected || !inputAmount) return;

    try {
      const rdt = getRdt();
      if (!rdt) return;

      const manifest = buildTransactionManifest(
        inputAmount,
        'resource_tdx_2_1tknxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      );

      await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
      });
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  return (
    <div className="bg-gray-800/30 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-700 rounded-lg text-blue-400">PT</button>
          <button className="px-4 py-2 bg-blue-500 rounded-lg">YT</button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg ml-2">
            Add Liquidity
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
            <Calculator className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Input</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <select className="bg-transparent text-lg focus:outline-none">
                <option>USD0++</option>
              </select>
              <input
                type="number"
                placeholder="0.0"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {isConnected ? 'Loading...' : '0'}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Output</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="text-lg">YT USD0++</div>
              <input
                type="number"
                placeholder="0.0"
                value={outputAmount}
                onChange={(e) => setOutputAmount(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {isConnected ? 'Loading...' : '0'}
            </div>
          </div>
        </div>

        <button
          className={`w-full py-4 rounded-lg font-semibold ${
            isConnected
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
          onClick={handleTrade}
          disabled={!isConnected}
        >
          {isConnected ? 'Trade' : 'Connect Wallet to Trade'}
        </button>
      </div>
    </div>
  );
}

export default TradingInterface;