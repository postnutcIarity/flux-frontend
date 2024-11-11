export interface RadixNetwork {
  connectButton: {
    create: () => HTMLElement;
  };
  walletApi: {
    subscribe: (callback: (state: any) => void) => (() => void) | undefined;
    sendTransaction: (params: any) => Promise<any>;
  };
}