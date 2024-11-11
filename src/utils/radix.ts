import { RadixNetwork } from '../types/radix';

const NETWORK_CONFIG = {
  networkId: 1,
  network: 'mainnet',
  dAppId: 'account_tdx_2_1289zm062j788dwrjefqkfgfeea5tkkdnh8htqhdrzdvjkql4kxceql',
};

export const loadRadixToolkit = (): Promise<RadixNetwork> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    if (window.RadixDappToolkit) {
      const rdt = window.RadixDappToolkit({
        dAppDefinitionAddress: NETWORK_CONFIG.dAppId,
        networkId: NETWORK_CONFIG.networkId,
        applicationName: 'Trading Dashboard',
        applicationVersion: '1.0.0',
      });
      resolve(rdt);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@radixdlt/radix-dapp-toolkit@1.4.1/dist/umd/bundle.umd.js';
    script.async = true;

    script.onload = () => {
      if (window.RadixDappToolkit) {
        const rdt = window.RadixDappToolkit({
          dAppDefinitionAddress: NETWORK_CONFIG.dAppId,
          networkId: NETWORK_CONFIG.networkId,
          applicationName: 'Trading Dashboard',
          applicationVersion: '1.0.0',
        });
        resolve(rdt);
      } else {
        reject(new Error('RadixDappToolkit not found on window object'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Radix DApp Toolkit script'));
    };

    document.head.appendChild(script);
  });
};