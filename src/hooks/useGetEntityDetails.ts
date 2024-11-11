import { useGateway } from './useGateway';
import { StateEntityDetailsOperationRequest } from '@radixdlt/babylon-gateway-api-sdk';

export const useGetEntityDetails = async (address: string) => {
  const gatewayApi = useGateway();

  const request: StateEntityDetailsOperationRequest = {
    stateEntityDetailsRequest: {
        addresses: [address], // Replace with your actual addresses
        at_ledger_state: null, // Optional
        opt_ins: {}, // Optional, replace with actual opt-in options if needed
        aggregation_level: undefined, // Optional
    },
};
  
  const response = await gatewayApi.state.innerClient.stateEntityDetails(request);
  console.log(response);


  // )
};
