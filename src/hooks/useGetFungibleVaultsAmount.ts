import { useState, useEffect } from 'react';
import { useGateway } from './useGateway';
import {
  EntityFungiblesPageRequest,
  StateEntityFungiblesPageRequest,
} from '@radixdlt/babylon-gateway-api-sdk';

export function useGetFungibleVaultsAmount(address: string | undefined) {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const gatewayApi = useGateway();

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    const fetchEntityDetails = async () => {
      try {
        const request: EntityFungiblesPageRequest = {
          stateEntityFungiblesPageRequest: {
            address: address,
            at_ledger_state: null,
            cursor: null,
            limit_per_page: 10,
            opt_ins: {},
            aggregation_level: undefined,
          },
        };

        const items = (await gatewayApi.state.innerClient.entityFungiblesPage(request)).items;

        const amount = items.reduce((sum, item) => {
          if ('amount' in item) {
            return sum + parseFloat(item.amount || '0');
          }
          return sum;
        }, 0);

        setTotalAmount(amount);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fungible vaults amount:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchEntityDetails();
  }, [address, gatewayApi]);

  return { totalAmount, loading, error };
}