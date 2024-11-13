import React from 'react';
import MarketsTable from '../components/MarketsTable';

export default function Markets() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Markets</h1>
      <MarketsTable />
    </div>
  );
}