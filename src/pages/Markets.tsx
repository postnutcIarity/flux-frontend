import React from 'react';
import { useNavigate } from 'react-router-dom';
import MarketsTable from '../components/MarketsTable';
import { useGetEntityDetails } from '../hooks/useGetEntityDetails';

export default function Markets() {
  const { state, loading, error } = useGetEntityDetails('component_tdx_2_1czuxwr7zax9wdk4dfc4n8lcqyankk39my5vfzymx4uu55gm5sv8vcr');

  console.log("Filtered Entity Data:", state);
  console.log("Loading:", loading);
  console.log("Error:", error);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Markets</h1>
      <MarketsTable />
    </div>
  );
}