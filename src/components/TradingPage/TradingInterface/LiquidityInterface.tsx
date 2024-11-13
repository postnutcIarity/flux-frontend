import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useConnectButtonState } from '../../../hooks/useConnectButtonState';
import { useFungibleTokenValue } from '../../../hooks/useFungibleTokenValue';
import { MARKET_INFO } from '../../../config/addresses';
import { useSendTransactionManifest } from '../../../hooks/useSendTransactionManifest';
import { useAccounts } from '../../../hooks/useAccounts';

export default function LiquidityInterface() {
  const connectButtonState = useConnectButtonState();
  const [firstAmount, setFirstAmount] = useState('');
  const [secondAmount, setSecondAmount] = useState('');
  const [firstToken, setFirstToken] = useState('PT');
  const [secondToken, setSecondToken] = useState('LSU');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { state: accountState } = useAccounts();
  const sendTransactionManifest = useSendTransactionManifest();

  const ptBalance = useFungibleTokenValue(MARKET_INFO.ptResource);
  const lsuBalance = useFungibleTokenValue(MARKET_INFO.assetResource);
  const poolUnitBalance = useFungibleTokenValue(MARKET_INFO.poolUnitResource);

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

  const validateTransaction = () => {
    if (!accountState.accounts[0]) {
      throw new Error('Please connect your wallet');
    }

    const ptAmount = firstToken === 'PT' ? parseFloat(firstAmount) : parseFloat(secondAmount);
    const assetAmount = firstToken === 'LSU' ? parseFloat(firstAmount) : parseFloat(secondAmount);

    if (isNaN(ptAmount) || ptAmount <= 0 || isNaN(assetAmount) || assetAmount <= 0) {
      throw new Error('Please enter valid amounts for both tokens');
    }

    const ptBalanceNum = parseFloat(ptBalance || '0');
    const lsuBalanceNum = parseFloat(lsuBalance || '0');

    if (ptAmount > ptBalanceNum) {
      throw new Error('Insufficient PT balance');
    }

    if (assetAmount > lsuBalanceNum) {
      throw new Error('Insufficient LSU balance');
    }

    return {
      accountAddress: accountState.accounts[0].address,
      ptAmount,
      assetAmount,
    };
  };

  const handleFirstTokenChange = (newToken: string) => {
    setFirstToken(newToken);
    setSecondToken(newToken === 'PT' ? 'LSU' : 'PT');
    setFirstAmount('');
    setSecondAmount('');
    setError(null);
  };

  const handleSecondTokenChange = (newToken: string) => {
    setSecondToken(newToken);
    setFirstToken(newToken === 'PT' ? 'LSU' : 'PT');
    setFirstAmount('');
    setSecondAmount('');
    setError(null);
  };

  const handleAddLiquidity = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = validateTransaction();
      await sendTransactionManifest().addLiquidity(params);
      
      setFirstAmount('');
      setSecondAmount('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add liquidity';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = connectButtonState === 'success';
  const hasValidAmounts = firstAmount && secondAmount;

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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {getBalance(secondToken)}
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
        onClick={handleAddLiquidity}
        disabled={!isConnected || isLoading || !hasValidAmounts}
        className={`w-full py-4 rounded-lg font-semibold transition-colors ${
          isConnected
            ? isLoading
              ? 'bg-blue-600 cursor-wait'
              : !hasValidAmounts
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {!isConnected 
          ? 'Connect Wallet' 
          : isLoading 
          ? 'Processing...' 
          : !hasValidAmounts 
          ? 'Enter amounts' 
          : 'Add Liquidity'}
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