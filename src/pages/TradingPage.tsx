import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRadixDappToolkit } from '../hooks/useRadixDappToolkit';
import { initializeGatewayApi } from '../config/radix';
import TradingChart from '../components/TradingPage/TradingChart';
import MarketInfo from '../components/TradingPage/MarketInfo';
import TradeHistory from '../components/TradingPage/TradeHistory';
import TradingInterface from '../components/TradingPage/TradingInterface';
import { useGetEntityDetails } from '../hooks/useGetEntityDetails';
import { useGetFungibleVaultsAmount } from '../hooks/useGetFungibleVaultsAmount';
import { formatCurrency } from '../utils/formatters';

export default function TradingPage() {
  const { marketId } = useParams();
  const { isConnected, account } = useRadixDappToolkit();

  // Get market details
  const { state: marketData } = useGetEntityDetails(
    `component_tdx_2_1czuxwr7zax9wdk4dfc4n8lcqyankk39my5vfzymx4uu55gm5sv8vcr`
  );

  // Get liquidity data
  const { totalAmount: liquidityAmount, loading: liquidityLoading } = useGetFungibleVaultsAmount(
    marketData?.poolComponent
  );

  const marketInfo = {
    liquidity: liquidityLoading ? 'Loading...' : formatCurrency(liquidityAmount),
    volume24h: '$2.73M',
    underlyingAPY: '8.5%',
    impliedAPY: '13.55%'
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!marketId) return;

      try {
        const gatewayApi = initializeGatewayApi();
        if (!gatewayApi) return;

        const response = await gatewayApi.state.getEntityDetails({
          addresses: [marketId],
        });

        console.log('Market data:', response);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    if (isConnected) {
      fetchMarketData();
    }
  }, [marketId, isConnected]);

  return (
    <div className="container mx-auto px-4 py-8">
      <MarketInfo {...marketInfo} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <TradingChart />
        </div>
        <div>
          <TradingInterface />
        </div>
      </div>

      <TradeHistory />
    </div>
  );
}