import { useMemo } from 'react';
import { useAccounts } from './useAccounts';

export const useFungibleTokenValue = (resourceAddress: string) => {
  const { state } = useAccounts();

  const tokenValue = useMemo(() => {
    for (const account of state.accounts) {
      const token = account.fungibleTokens[resourceAddress];
      if (token) {
        return token.value;
      }
    }
    return null;
  }, [state.accounts, resourceAddress]);

  return tokenValue;
};
