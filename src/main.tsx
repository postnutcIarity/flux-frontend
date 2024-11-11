import { RadixDappToolkit, RadixNetwork } from '@radixdlt/radix-dapp-toolkit';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { RdtProvider } from './contexts/RdtProvider.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const rdt = RadixDappToolkit({
  dAppDefinitionAddress:
    'account_tdx_2_12y7yjk7h0k5cd45au6kthphe83pxrutencm9xh3vtu3p8kllcgxf33',
  networkId: RadixNetwork.Stokenet, // network ID 2 is for the stokenet test network, network ID 1 is for mainnet
  applicationName: 'Yield AMM dApp',
  applicationVersion: '1.0.0',
});
console.log('dApp Toolkit: ', rdt);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RdtProvider value={rdt}>
      <App />
    </RdtProvider>
  </React.StrictMode>
);

// Ensure the DApp Toolkit is loaded before rendering
// const waitForToolkit = () => {
//   if (window.RadixDappToolkit) {
//     root.render(
//       <React.StrictMode>
//         <App />
//       </React.StrictMode>
//     );
//   } else {
//     setTimeout(waitForToolkit, 50);
//   }
// };

// waitForToolkit();
