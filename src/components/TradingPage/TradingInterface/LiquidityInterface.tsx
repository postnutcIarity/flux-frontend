import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useConnectButtonState } from '../../../hooks/useConnectButtonState';
import { useFungibleTokenValue } from '../../../hooks/useFungibleTokenValue';
import { MARKET_INFO } from '../../../config/addresses';
import { useSendTransactionManifest } from '../../../hooks/useSendTransactionManifest';
import { useAccounts } from '../../../hooks/useAccounts';

type LiquidityAction = 'add' | 'remove';

export default function LiquidityInterface() {
  const [action, setAction] = useState<LiquidityAction>('add');
  const [firstAmount, setFirstAmount] = useState('');
  const [secondAmount, setSecondAmount] = useState('');
  const [poolUnits, setPoolUnits] = useState('');
  const [firstToken, setFirstToken] = useState('PT');
  const [secondToken, setSecondToken] = useState('LSU');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { state: accountState } = useAccounts();
  const sendTransactionManifest = useSendTransactionManifest();
  const connectButtonState = useConnectButtonState();

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

  const validateAddLiquidity = () => {
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

  const validateRemoveLiquidity = () => {
    if (!accountState.accounts[0]) {
      throw new Error('Please connect your wallet');
    }

    const units = parseFloat(poolUnits);
    if (isNaN(units) || units <= 0) {
      throw new Error('Please enter a valid amount of pool units');
    }

    const balance = parseFloat(poolUnitBalance || '0');
    if (units > balance) {
      throw new Error('Insufficient pool units balance');
    }

    return {
      accountAddress: accountState.accounts[0].address,
      poolUnits: units,
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (action === 'add') {
        const params = validateAddLiquidity();
        await sendTransactionManifest().addLiquidity(params);
        setFirstAmount('');
        setSecondAmount('');
      } else {
        const params = validateRemoveLiquidity();
        await sendTransactionManifest().removeLiquidity(params);
        setPoolUnits('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = connectButtonState === 'success';
  const hasValidAmounts = action === 'add' 
    ? firstAmount && secondAmount 
    : poolUnits;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setAction('add');
              setError(null);
              setFirstAmount('');
              setSecondAmount('');
              setPoolUnits('');
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              action === 'add'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Add
          </button>
          <button
            onClick={() => {
              setAction('remove');
              setError(null);
              setFirstAmount('');
              setSecondAmount('');
              setPoolUnits('');
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              action === 'remove'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Remove
          </button>
        </div>
        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
          <Calculator className="h-5 w-5" />
        </button>
      </div>

      {action === 'add' ? (
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
      ) : (
        <div className="bg-gray-900/50 rounded-lg p-4">
          <label className="block text-sm text-gray-400 mb-2">Pool Units to Remove</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">Pool Units</span>
              <input
                type="number"
                placeholder="0.0"
                value={poolUnits}
                onChange={(e) => setPoolUnits(e.target.value)}
                className="bg-transparent text-right text-lg focus:outline-none w-1/2"
                disabled={isLoading}
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {getBalance('POOL_UNIT')}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
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
          : `${action === 'add' ? 'Add' : 'Remove'} Liquidity`}
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