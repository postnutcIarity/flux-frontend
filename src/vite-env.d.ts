/// <reference types="vite/client" />

interface Window {
  RadixDappToolkit: (config: {
    dAppDefinitionAddress: string;
    networkId: number;
    applicationName: string;
    applicationVersion: string;
  }) => any;
}