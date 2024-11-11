import React, { useEffect, useRef } from 'react';
import { useRadixDappToolkit } from '../hooks/useRadixDappToolkit';
import { getRdt } from '../config/radix';

export default function RadixConnectButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { isConnected, isInitialized } = useRadixDappToolkit();

  useEffect(() => {
    if (!isInitialized || !buttonRef.current) return;

    try {
      const rdt = getRdt();
      if (!rdt) return;

      const button = rdt.connectButton.create();
      buttonRef.current.appendChild(button);

      return () => {
        if (buttonRef.current?.contains(button)) {
          buttonRef.current.removeChild(button);
        }
      };
    } catch (error) {
      console.error('Error creating Radix connect button:', error);
    }
  }, [isInitialized]);

  return (
    <div className="flex items-center gap-2">
      {isConnected && (
        <span className="text-green-400 text-sm">Connected</span>
      )}
      <div ref={buttonRef} className="radix-connect-button" />
    </div>
  );
}