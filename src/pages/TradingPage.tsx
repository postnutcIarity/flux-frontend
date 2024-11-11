import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRadixDappToolkit } from '../hooks/useRadixDappToolkit';
import { initializeGatewayApi } from '../config/radix';
import TradingChart from '../components/TradingPage/TradingChart';
import MarketInfo from '../components/TradingPage/MarketInfo';
import TradeHistory from '../components/TradingPage/TradeHistory';
import TradingInterface from '../components/TradingPage/TradingInterface';

const marketInfo = {
  liquidity: '$77.79M',
  volume24h: '$2.73M',
  underlyingAPY: '8.5%',
  impliedAPY: '13.55%'
};

export default function TradingPage() {
  const { marketId } = useParams();
  const { isConnected, account } = useRadixDappToolkit();

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