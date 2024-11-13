import React from 'react';
import { useParams } from 'react-router-dom';
import { useRadixDappToolkit } from '../hooks/useRadixDappToolkit';
import TradingChart from '../components/TradingPage/TradingChart';
import MarketInfo from '../components/TradingPage/MarketInfo';
import TradeHistory from '../components/TradingPage/TradeHistory';
import TradingInterface from '../components/TradingPage/TradingInterface';
import { useGetEntityDetails } from '../hooks/useGetEntityDetails';
import { useGetFungibleVaultsAmount } from '../hooks/useGetFungibleVaultsAmount';
import { formatCurrency, formatRate } from '../utils/formatters';
import { MARKET_ADDRESSES } from '../config/addresses';

export default function TradingPage() {
  const { marketId } = useParams();
  const { isConnected } = useRadixDappToolkit();

  // Get market details
  const { state: marketData, loading: marketLoading } = useGetEntityDetails(
    MARKET_ADDRESSES.LSULP
  );

  // Get liquidity data
  const { totalAmount: liquidityAmount, loading: liquidityLoading } = useGetFungibleVaultsAmount(
    marketData?.poolComponent
  );

  const marketInfo = {
    liquidity: liquidityLoading ? 'Loading...' : formatCurrency(liquidityAmount),
    volume24h: '$2.73M',
    underlyingAPY: '8.5%',
    impliedAPY: marketData ? formatRate(marketData.impliedRate) : 'Loading...'
  };

  if (marketLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MarketInfo {...marketInfo} />
      
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <TradingChart />
        </div>
        <div className="h-full order-1 lg:order-2">
          <TradingInterface />
        </div>
      </div>

      <TradeHistory />
    </div>
  );
}