import React, { ReactNode } from 'react';
import { RadixContext, Radix } from './rdt-context';

export const RdtProvider = ({
  value,
  children,
}: {
  value: Radix;
  children: ReactNode;
}) => <RadixContext.Provider value={value}>{children}</RadixContext.Provider>;
