import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit';
import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk';

export const NETWORK_CONFIG = {
  networkId: 1,
  network: 'mainnet' as const,
  gateway: 'https://mainnet.radixdlt.com',
} as const;

export const DAPP_CONFIG = {
  dAppDefinitionAddress: 'account_tdx_2_1289zm062j788dwrjefqkfgfeea5tkkdnh8htqhdrzdvjkql4kxceql',
  dAppName: 'Trading Dashboard',
  version: '1.0.0',
} as const;

let rdtInstance: ReturnType<typeof RadixDappToolkit> | null = null;
let gatewayApiClient: GatewayApiClient | null = null;

export const initializeGatewayApi = () => {
  if (!gatewayApiClient) {
    try {
      gatewayApiClient = new GatewayApiClient({
        basePath: NETWORK_CONFIG.gateway,
      });
    } catch (error) {
      console.error('Failed to initialize Gateway API:', error);
      return null;
    }
  }
  return gatewayApiClient;
};

export const getRdt = () => {
  if (!rdtInstance && typeof window !== 'undefined' && window.RadixDappToolkit) {
    try {
      rdtInstance = window.RadixDappToolkit({
        dAppDefinitionAddress: DAPP_CONFIG.dAppDefinitionAddress,
        networkId: NETWORK_CONFIG.networkId,
        applicationName: DAPP_CONFIG.dAppName,
        applicationVersion: DAPP_CONFIG.version,
      });
    } catch (error) {
      console.error('Failed to initialize Radix DApp Toolkit:', error);
      return null;
    }
  }
  return rdtInstance;
};