import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useConnectButtonState } from '../../../hooks/useConnectButtonState';
import { useFungibleTokenValue } from '../../../hooks/useFungibleTokenValue';
import { MARKET_INFO } from '../../../config/addresses';
import { useSendTransactionManifest } from '../../../hooks/useSendTransactionManifest';
import { useAccounts } from '../../../hooks/useAccounts';

export default function TokenizeInterface() {
  const [inputAmount, setInputAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { state: accountState } = useAccounts();
  const sendTransactionManifest = useSendTransactionManifest();
  const connectButtonState = useConnectButtonState();

  // Get token balances
  const lsuBalance = useFungibleTokenValue(MARKET_INFO.assetResource);
  const ptBalance = useFungibleTokenValue(MARKET_INFO.ptResource);
  const ytBalance = useFungibleTokenValue(MARKET_INFO.ytResource);

  const validateTransaction = () => {
    if (!accountState.accounts[0]) {
      throw new Error('Please connect your wallet');
    }

    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Please enter a valid amount');
    }

    const balance = parseFloat(lsuBalance || '0');
    if (amount > balance) {
      throw new Error('Insufficient LSU balance');
    }

    return {
      accountAddress: accountState.accounts[0].address,
      assetAmount: amount,
    };
  };

  const handleTokenize = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = validateTransaction();
      await sendTransactionManifest().tokenizeYield(params);
      setInputAmount('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
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

      <div>
        <label className="block text-sm text-gray-400 mb-2">Amount to Tokenize</label>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg">LSU</span>
            <input
              type="number"
              placeholder="0.0"
              value={inputAmount}
              onChange={(e) => {
                setInputAmount(e.target.value);
                setError(null);
              }}
              className="bg-transparent text-right text-lg focus:outline-none w-1/2"
              disabled={isLoading}
            />
          </div>
          <div className="text-right text-sm text-gray-400 mt-1">
            Balance: {lsuBalance || '0'}
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">You Will Receive</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">PT</span>
              <input
                type="number"
                placeholder="0.0"
                value={inputAmount} // 1:1 ratio for now
                readOnly
                className="bg-transparent text-right text-lg focus:outline-none w-1/2 cursor-not-allowed"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {ptBalance || '0'}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">YT</span>
              <input
                type="number"
                placeholder="0.0"
                value={inputAmount} // 1:1 ratio for now
                readOnly
                className="bg-transparent text-right text-lg focus:outline-none w-1/2 cursor-not-allowed"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {ytBalance || '0'}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleTokenize}
        disabled={!isConnected || isLoading || !inputAmount}
        className={`w-full py-4 rounded-lg font-semibold transition-colors ${
          isConnected
            ? isLoading
              ? 'bg-blue-600 cursor-wait'
              : !inputAmount
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {!isConnected 
          ? 'Connect Wallet' 
          : isLoading 
          ? 'Processing...' 
          : !inputAmount 
          ? 'Enter an amount' 
          : 'Tokenize'}
      </button>

      {isConnected && (
        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Rate</span>
            <span>1 LSU = 1 PT + 1 YT</span>
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