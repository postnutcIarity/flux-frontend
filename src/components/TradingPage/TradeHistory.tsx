import React, { useState } from 'react';
import TradeHistoryFilters from './TradeHistory/TradeHistoryFilters';
import TradesTable from './TradeHistory/TradesTable';
import LiquidityTable from './TradeHistory/LiquidityTable';

const trades = [
  {
    time: '3h 24m',
    action: 'Short Yield',
    impliedAPY: '13.55%',
    value: '$5,621.65',
    notionalSize: '5,905.64 PT',
  },
  {
    time: '3h 33m',
    action: 'Long Yield',
    impliedAPY: '13.55%',
    value: '$11,202.00',
    notionalSize: '11,767.3 PT',
  },
  {
    time: '3h 38m',
    action: 'Short Yield',
    impliedAPY: '13.51%',
    value: '$761,428',
    notionalSize: '800,000 PT',
  },
  {
    time: '3h 47m',
    action: 'Long Yield',
    impliedAPY: '13.64%',
    value: '$750,276',
    notionalSize: '788,948 PT',
  },
  {
    time: '3h 50m',
    action: 'Long Yield',
    impliedAPY: '13.51%',
    value: '$202,867',
    notionalSize: '213,234 PT',
  },
] as const;

const liquidityActions = [
  {
    time: '4h 24m',
    action: 'Remove Liquidity',
    value: '$52,188.50',
  },
  {
    time: '6h 15m',
    action: 'Remove Liquidity',
    value: '$5,000.00',
  },
  {
    time: '6h 46m',
    action: 'Remove Liquidity',
    value: '$488,418',
  },
  {
    time: '7h 44m',
    action: 'Add Liquidity',
    value: '$3,998.13',
  },
] as const;

function TradeHistory() {
  const [viewType, setViewType] = useState<'trades' | 'liquidity'>('trades');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedValue, setSelectedValue] = useState('all');

  return (
    <div className="bg-gray-800/30 rounded-lg overflow-hidden">
      <TradeHistoryFilters
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        viewType={viewType}
        setViewType={setViewType}
      />
      
      <div className="overflow-x-auto">
        {viewType === 'trades' ? (
          <TradesTable
            trades={trades}
            selectedAction={selectedAction}
            selectedValue={selectedValue}
          />
        ) : (
          <LiquidityTable
            actions={liquidityActions}
            selectedAction={selectedAction}
            selectedValue={selectedValue}
          />
        )}
      </div>
    </div>
  );
}

export default TradeHistory;