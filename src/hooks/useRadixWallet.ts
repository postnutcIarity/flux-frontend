import { useState, useEffect, useCallback } from 'react';
import { RadixNetwork } from '../types/radix';
import { loadRadixToolkit } from '../utils/radix';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balances: any[];
}

export function useRadixWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balances: []
  });

  const [toolkit, setToolkit] = useState<RadixNetwork | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = 1000;

    const initializeToolkit = async () => {
      try {
        const rdt = await loadRadixToolkit();
        if (mounted) {
          setToolkit(rdt);
        }
      } catch (error) {
        if (retryCount < maxRetries && mounted) {
          retryCount++;
          setTimeout(initializeToolkit, retryInterval);
        }
      }
    };

    initializeToolkit();

    return () => {
      mounted = false;
    };
  }, []);

  const initializeButton = useCallback((container: HTMLDivElement) => {
    if (!toolkit) return () => {};

    try {
      const button = toolkit.connectButton.create();
      container.appendChild(button);

      const unsubscribe = toolkit.walletApi.subscribe((state: any) => {
        setWalletState({
          isConnected: state.connected,
          address: state.accounts?.[0]?.address || null,
          balances: []
        });
      });

      return () => {
        if (container.contains(button)) {
          container.removeChild(button);
        }
        unsubscribe?.();
      };
    } catch (error) {
      console.error('Error creating Radix connect button:', error);
      return () => {};
    }
  }, [toolkit]);

  return {
    ...walletState,
    toolkit,
    initializeButton
  };
}