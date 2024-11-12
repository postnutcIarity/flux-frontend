import { useState, useEffect } from 'react';
import { MARKET_ADDRESSES, MarketKey } from '../config/addresses';
import { useGetEntityDetails } from './useGetEntityDetails';
import { useGetFungibleVaultsAmount } from './useGetFungibleVaultsAmount';
import { formatCurrency, formatRate } from '../utils/formatters';

export interface MarketData {
  name: MarketKey;
  maturity: string;
  liquidity: string;
  longYieldAPY: string;
  fixedAPY: string;
}

export function useMarketData() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial market data
  const { 
    state: lsulpData, 
    loading: lsulpLoading, 
    error: lsulpError 
  } = useGetEntityDetails(MARKET_ADDRESSES.LSULP);

  // Fetch liquidity data using poolComponent
  const { 
    totalAmount: liquidityAmount,
    loading: liquidityLoading,
    error: liquidityError
  } = useGetFungibleVaultsAmount(lsulpData?.poolComponent);

  useEffect(() => {
    // Wait for both data fetches to complete
    if (lsulpLoading || liquidityLoading) return;

    if (lsulpError) {
      setError(lsulpError);
      setLoading(false);
      return;
    }

    if (liquidityError) {
      setError(liquidityError);
      setLoading(false);
      return;
    }

    if (lsulpData) {
      const impliedAPY = formatRate(lsulpData.impliedRate);
      
      const marketData: MarketData[] = [{
        name: 'LSULP',
        maturity: lsulpData.maturityDate || 'N/A',
        liquidity: formatCurrency(liquidityAmount),
        longYieldAPY: impliedAPY,
        fixedAPY: impliedAPY,
      }];

      setMarkets(marketData);
    }

    setLoading(false);
  }, [lsulpData, lsulpLoading, lsulpError, liquidityAmount, liquidityLoading, liquidityError]);

  return { markets, loading, error };
}