import React from 'react';

interface LiquidityAction {
  time: string;
  action: 'Add Liquidity' | 'Remove Liquidity';
  value: string;
}

interface LiquidityTableProps {
  actions: LiquidityAction[];
  selectedAction: string;
  selectedValue: string;
}

export default function LiquidityTable({ actions, selectedAction, selectedValue }: LiquidityTableProps) {
  const filterActions = (action: LiquidityAction) => {
    const valueNum = parseFloat(action.value.replace(/[$,]/g, ''));
    const matchesAction = selectedAction === 'all' || 
      (selectedAction === 'add' && action.action === 'Add Liquidity') ||
      (selectedAction === 'remove' && action.action === 'Remove Liquidity');
    
    const matchesValue = selectedValue === 'all' ||
      (selectedValue === '0-1000' && valueNum <= 1000) ||
      (selectedValue === '1000-10000' && valueNum > 1000 && valueNum <= 10000) ||
      (selectedValue === '10000-100000' && valueNum > 10000 && valueNum <= 100000) ||
      (selectedValue === '100000+' && valueNum > 100000);

    return matchesAction && matchesValue;
  };

  const filteredActions = actions.filter(filterActions);

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-800/50">
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Time</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Action</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Value</th>
        </tr>
      </thead>
      <tbody>
        {filteredActions.map((action, index) => (
          <tr
            key={index}
            className="border-t border-gray-800/50 hover:bg-gray-800/30 transition-colors"
          >
            <td className="px-6 py-4 text-sm text-gray-300">{action.time}</td>
            <td className="px-6 py-4 text-sm">
              <span
                className={`${
                  action.action === 'Add Liquidity' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {action.action}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-300">{action.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}