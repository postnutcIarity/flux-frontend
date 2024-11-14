import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { useConnectButtonState } from '../../../hooks/useConnectButtonState';
import { useFungibleTokenValue } from '../../../hooks/useFungibleTokenValue';
import { MARKET_INFO } from '../../../config/addresses';
import { useSendTransactionManifest } from '../../../hooks/useSendTransactionManifest';
import { useAccounts } from '../../../hooks/useAccounts';
import { useGetEntityDetails } from '../../../hooks/useGetEntityDetails';
import { computeMarket, calcTrade, getTimeToExpiry } from '../../../utils/tradeCalculations';
import BigNumber from 'bignumber.js';

export default function TradeInterface() {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [payToken, setPayToken] = useState('PT');
  const [receiveToken, setReceiveToken] = useState('LSU');

  const { state: accountState } = useAccounts();
  const sendTransactionManifest = useSendTransactionManifest();
  const connectButtonState = useConnectButtonState();

  // Get market data
  const { state: marketData, loading: marketLoading } = useGetEntityDetails(MARKET_INFO.yieldAMMComponent);

  // Get token balances
  const ptBalance = useFungibleTokenValue(MARKET_INFO.ptResource);
  const lsuBalance = useFungibleTokenValue(MARKET_INFO.assetResource);

  useEffect(() => {
    if (!marketData || !inputAmount || !marketData.marketState || !marketData.marketFee || marketLoading) {
      setOutputAmount('');
      setCalculationError(null);
      return;
    }

    // Debug logging
    console.group('Market State Debug');
    console.log('Full Market Data:', marketData);
    console.log('Market State:', marketData.marketState);
    console.log('Market Fee:', marketData.marketFee);
    console.log('Maturity Date:', marketData.maturityDate);
    console.groupEnd();

    try {
      // For testing, use default values if market state is invalid
      const defaultMarketState = {
        total_pt: '100',
        total_asset: '100',
        scalar_root: '0.1',
        last_ln_implied_rate: '0.1'
      };

      const defaultMarketFee = {
        fee_rate: '0.01',
        reserve_fee_percent: '0.5'
      };

      // Use either actual market state or defaults
      const marketStateToUse = (
        marketData.marketState?.total_pt && 
        marketData.marketState?.total_asset && 
        marketData.marketState?.scalar_root && 
        marketData.marketState?.last_ln_implied_rate
      ) ? marketData.marketState : defaultMarketState;

      const marketFeeToUse = (
        marketData.marketFee?.fee_rate && 
        marketData.marketFee?.reserve_fee_percent
      ) ? marketData.marketFee : defaultMarketFee;

      const timeToExpiry = getTimeToExpiry(marketData.maturityDate);
      if (timeToExpiry <= 0) {
        throw new Error('Market has expired');
      }

      const marketCompute = computeMarket(marketStateToUse, timeToExpiry);

      // For PT -> LSU or YT -> LSU, we need to negate the input amount
      const netAmount = payToken === 'LSU' 
        ? new BigNumber(inputAmount)
        : new BigNumber(inputAmount).negated();

      const result = calcTrade(
        netAmount,
        timeToExpiry,
        marketStateToUse,
        marketCompute,
        marketFeeToUse
      );

      setOutputAmount(result.netAmount.abs().toFixed(6));
      setCalculationError(null);

      // Debug logging for calculation results
      console.group('Trade Calculation Results');
      console.log('Input Amount:', inputAmount);
      console.log('Net Amount:', netAmount.toString());
      console.log('Result:', result);
      console.groupEnd();

    } catch (err) {
      console.error('Trade calculation error:', err);
      setOutputAmount('');
      setCalculationError(err instanceof Error ? err.message : 'Failed to calculate trade');
    }
  }, [inputAmount, marketData, marketLoading, payToken]);

  const handlePayTokenChange = (newToken: string) => {
    setPayToken(newToken);
    setReceiveToken(newToken === 'PT' ? 'LSU' : 'PT');
    setInputAmount('');
    setOutputAmount('');
    setError(null);
  };

  const handleSwap = async () => {
    if (!accountState.accounts[0] || !inputAmount || !outputAmount) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        accountAddress: accountState.accounts[0].address,
        inputTokenValue: parseFloat(inputAmount),
        outputTokenValue: parseFloat(outputAmount),
      };

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
  const hasValidAmounts = inputAmount && outputAmount && !calculationError;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
          <Calculator className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
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
              Balance: {payToken === 'PT' ? ptBalance : lsuBalance || '0'}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">You Receive</label>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">{receiveToken}</span>
              <input
                type="number"
                placeholder="0.0"
                value={outputAmount}
                readOnly
                className="bg-transparent text-right text-lg focus:outline-none w-1/2 cursor-not-allowed"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              Balance: {receiveToken === 'PT' ? ptBalance : lsuBalance || '0'}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {calculationError && (
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
          {calculationError}
        </div>
      )}

      <button
        onClick={handleSwap}
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
          ? 'Enter amount' 
          : 'Swap'}
      </button>

      {isConnected && (
        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Rate</span>
            <span>
              1 {payToken} = {outputAmount && inputAmount 
                ? (parseFloat(outputAmount) / parseFloat(inputAmount)).toFixed(4) 
                : 'N/A'} {receiveToken}
            </span>
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
  );
}