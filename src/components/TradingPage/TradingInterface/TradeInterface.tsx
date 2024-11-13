import React, { useState } from 'react';
import { Calculator, ArrowDownUp } from 'lucide-react';
import { useFungibleTokenValue } from '../../../hooks/useFungibleTokenValue';
import { MARKET_INFO } from '../../../config/addresses';
import { useConnectButtonState } from '../../../hooks/useConnectButtonState';
import { useSendTransactionManifest } from '../../../hooks/useSendTransactionManifest';
import { useAccounts } from '../../../hooks/useAccounts';

export default function TradeInterface() {
  const connectButtonState = useConnectButtonState();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payToken, setPayToken] = useState('PT');
  const [receiveToken, setReceiveToken] = useState('LSU');
  const { state: accountState } = useAccounts();
  const sendTransactionManifest = useSendTransactionManifest();

  const ptBalance = useFungibleTokenValue(MARKET_INFO.ptResource);
  const lsuBalance = useFungibleTokenValue(MARKET_INFO.assetResource);

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

  const validateTransaction = () => {
    if (!accountState.accounts[0]) {
      throw new Error('Please connect your wallet');
    }

    const inputValue = parseFloat(inputAmount);
    if (isNaN(inputValue) || inputValue <= 0) {
      throw new Error('Please enter a valid amount');
    }

    const balance = parseFloat(getBalance(payToken));
    if (inputValue > balance) {
      throw new Error(`Insufficient ${payToken} balance`);
    }

    return {
      accountAddress: accountState.accounts[0].address,
      inputTokenValue: inputValue,
      outputTokenValue: parseFloat(outputAmount) || 0,
    };
  };

  const handlePayTokenChange = (newToken: string) => {
    setPayToken(newToken);
    setReceiveToken(newToken === 'PT' ? 'LSU' : 'PT');
    setInputAmount('');
    setOutputAmount('');
    setError(null);
  };

  const handleReceiveTokenChange = (newToken: string) => {
    setReceiveToken(newToken);
    setPayToken(newToken === 'PT' ? 'LSU' : 'PT');
    setInputAmount('');
    setOutputAmount('');
    setError(null);
  };

  const handleSwapTokens = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
    setError(null);
  };

  const handleTrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = validateTransaction();

      if (payToken === 'PT') {
        await sendTransactionManifest().swapExactPtForAsset(params);
      } else {
        await sendTransactionManifest().swapExactAssetForPt(params);
      }

      setInputAmount('');
      setOutputAmount('');
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

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm text-gray-400 mb-2">You Pay</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <select 
                className="bg-transparent text-lg focus:outline-none"
                value={payToken}
                onChange={(e) => handlePayTokenChange(e.target.value)}
                disabled={isLoading}
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
                disabled={isLoading}
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
            disabled={isLoading}
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
                onChange={(e) => handleReceiveTokenChange(e.target.value)}
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {getBalance(receiveToken)}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleTrade}
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
            : 'Swap'}
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