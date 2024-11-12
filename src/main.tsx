import { RadixDappToolkit, RadixNetwork } from '@radixdlt/radix-dapp-toolkit';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { RdtProvider } from './contexts/RdtProvider.tsx';
import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'
import { GatewayProvider } from './contexts/GatewayProvider.tsx'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const rdt = RadixDappToolkit({
  dAppDefinitionAddress:
    'account_tdx_2_12y7yjk7h0k5cd45au6kthphe83pxrutencm9xh3vtu3p8kllcgxf33',
  networkId: RadixNetwork.Stokenet, // network ID 2 is for the stokenet test network, network ID 1 is for mainnet
  applicationName: 'Wild dApp',
  applicationVersion: '1.0.0',
});
console.log('dApp Toolkit: ', rdt);

const gateway = GatewayApiClient.initialize({
  basePath: 'https://stokenet.radixdlt.com',
  applicationName: 'Wild dApp',
  applicationDappDefinitionAddress: 'account_tdx_2_12y7yjk7h0k5cd45au6kthphe83pxrutencm9xh3vtu3p8kllcgxf33',
})
console.log('Gateway:', gateway);


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GatewayProvider value={gateway}>
    <RdtProvider value={rdt}>
      <App />
    </RdtProvider>
    </GatewayProvider>
  </React.StrictMode>
);

