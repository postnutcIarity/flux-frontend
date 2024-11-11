interface RadixDappToolkitOptions {
  dAppDefinitionAddress: string;
  networkId: number;
  applicationName: string;
  applicationVersion: string;
}

interface RadixWalletApi {
  sendTransaction: (options: { transactionManifest: string; version: number }) => Promise<void>;
  subscribe: (callback: (state: any) => void) => () => void;
}

interface RadixConnectButton {
  create: () => HTMLElement;
}

interface RadixDappToolkit {
  walletApi: RadixWalletApi;
  connectButton: RadixConnectButton;
}

declare global {
  interface Window {
    RadixDappToolkit: (options: RadixDappToolkitOptions) => RadixDappToolkit;
  }
}