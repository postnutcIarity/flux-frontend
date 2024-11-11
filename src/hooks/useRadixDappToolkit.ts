import { useState, useEffect } from 'react';
import { getRdt, initializeGatewayApi } from '../config/radix';

interface WalletState {
  accounts: Array<{
    address: string;
    label?: string;
  }>;
  connected: boolean;
  interactionId?: string;
}

export function useRadixDappToolkit() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initialize = async () => {
      try {
        // Initialize Gateway API
        const gatewayApi = initializeGatewayApi();
        if (!gatewayApi) return;

        // Initialize DApp Toolkit
        const rdt = getRdt();
        if (!rdt) return;

        unsubscribe = rdt.walletApi.subscribe((state: WalletState) => {
          setIsConnected(state.connected);
          setAccount(state.connected && state.accounts[0] ? state.accounts[0].address : null);
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing Radix:', error);
      }
    };

    initialize();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return {
    isConnected,
    account,
    isInitialized,
    rdt: getRdt(),
  };
}