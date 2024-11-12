import { useState, useEffect } from 'react';
import { useGateway } from './useGateway';
import { StateEntityDetailsOperationRequest } from '@radixdlt/babylon-gateway-api-sdk';
import { extractEntityFields } from '../helpers/extractEntityFields';

export const useGetEntityDetails = (address: string) => {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const gatewayApi = useGateway();

  useEffect(() => {
    const fetchEntityDetails = async () => {
      try {
        const request: StateEntityDetailsOperationRequest = {
          stateEntityDetailsRequest: {
            addresses: [address],
            at_ledger_state: null,
            opt_ins: {},
            aggregation_level: undefined,
          },
        };

        const response = await gatewayApi.state.innerClient.stateEntityDetails(request);
        const details = response.items[0]?.details;

        console.group('Entity Details Response');
        console.log('Raw Response:', response);
        console.log('Details:', details);

        if (details?.type === 'Component') {
          const filteredData = extractEntityFields(details.state);
          console.log('Extracted Fields:', {
            poolComponent: filteredData.poolComponent,
            yieldTokenizerComponent: filteredData.yieldTokenizerComponent,
            marketFee: filteredData.marketFee,
            marketState: filteredData.marketState,
            marketInfo: filteredData.marketInfo,
            marketIsActive: filteredData.marketIsActive,
            maturityDate: filteredData.maturityDate,
          });
          setState(filteredData);
        } else {
          console.warn(`Unexpected details type: ${details?.type}`);
          setState(null);
        }
        console.groupEnd();
      } catch (err) {
        console.error("Error fetching entity details:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntityDetails();
  }, [address, gatewayApi]);

  return { state, loading, error };
};