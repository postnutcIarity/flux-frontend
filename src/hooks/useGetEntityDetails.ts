import { useGateway } from './useGateway';

export const useGetEntityDetails = (address: string) => {
  const gatewayApi = useGateway();

  gatewayApi.state.getEntityMetadata(address).then((res) =>
  
  
  )
};
