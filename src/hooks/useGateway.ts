import { useContext } from 'react';
import { GatewayContext } from '../contexts/gateway-context';

export const useGateway = () => useContext(GatewayContext)!;
