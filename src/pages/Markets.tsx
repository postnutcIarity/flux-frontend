import React from 'react';
import MarketsTable from '../components/MarketsTable';
import { AccountWithTokens, useAccounts } from '../hooks/useAccounts'
import { MARKET_RESOURCES } from '../config/addresses';
import { useFungibleTokenValue } from '../hooks/useFungibleTokenValue';



export default function Markets() {

  const {
    refresh,
    state: { accounts, status, hasLoaded: hasAccountsLoaded },
  } = useAccounts()

  console.log("Account: ", accounts);
  console.log("Status: ", status);
  console.log("Loaded: ", hasAccountsLoaded);

  const tokenValue = useFungibleTokenValue(MARKET_RESOURCES.LSU);

  console.log(tokenValue)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Markets</h1>
      <MarketsTable />
    </div>
  );
}