import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts';

interface ChartData {
  time: UTCTimestamp;
  value: number;
}

function generateDummyData(days: number): ChartData[] {
  const data: ChartData[] = [];
  const now = new Date();
  let baseValue = 13.5;

  for (let i = 0; i < days; i++) {
    const time = new Date(now);
    time.setDate(now.getDate() - (days - i));
    
    // Add some random variation
    baseValue = baseValue + (Math.random() - 0.5) * 0.2;
    
    data.push({
      time: (time.getTime() / 1000) as UTCTimestamp,
      value: baseValue
    });
  }

  return data;
}

export default function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<'market-info' | 'charts'>('charts');

  useEffect(() => {
    if (!chartContainerRef.current || activeTab !== 'charts') return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: '#1F2937' },
        horzLines: { color: '#1F2937' },
      },
      width: chartContainerRef.current.clientWidth,
      height: window.innerWidth < 768 ? 400 : 600,
    });

    // Create line series
    const impliedAPYSeries = chart.addLineSeries({
      color: '#60A5FA',
      lineWidth: 2,
      title: 'Implied APY',
    });

    const underlyingAPYSeries = chart.addLineSeries({
      color: '#34D399',
      lineWidth: 2,
      title: 'Underlying APY',
    });

    // Set data
    const impliedData = generateDummyData(30);
    const underlyingData = generateDummyData(30).map(item => ({
      ...item,
      value: item.value - 1.5 + (Math.random() - 0.5) * 0.1
    }));

    impliedAPYSeries.setData(impliedData);
    underlyingAPYSeries.setData(underlyingData);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: window.innerWidth < 768 ? 400 : 600,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    chartRef.current = chart;

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [activeTab]);

  return (
    <div className="bg-gray-800/30 rounded-lg h-[500px] lg:h-[700px]">
      <div className="flex border-b border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('market-info')}
          className={`px-3 lg:px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap
            ${activeTab === 'market-info'
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          Market Info
          {activeTab === 'market-info' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-3 lg:px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap
            ${activeTab === 'charts'
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          Charts
          {activeTab === 'charts' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      <div className="p-2 lg:p-4 h-[calc(100%-41px)]">
        {activeTab === 'charts' && (
          <>
            <div className="flex space-x-2 lg:space-x-4 mb-4 overflow-x-auto">
              {['1D', '1W', '1M', '3M', 'ALL'].map((period) => (
                <button
                  key={period}
                  className="px-2 lg:px-3 py-1 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors whitespace-nowrap"
                >
                  {period}
                </button>
              ))}
            </div>
            <div ref={chartContainerRef} className="w-full h-[calc(100%-40px)]" />
          </>
        )}
        {activeTab === 'market-info' && (
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Total Value Locked</div>
                <div className="text-lg lg:text-xl font-semibold">$24.5M</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">24h Volume</div>
                <div className="text-lg lg:text-xl font-semibold">$1.2M</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Total Fees</div>
                <div className="text-lg lg:text-xl font-semibold">$45.3K</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Unique Traders</div>
                <div className="text-lg lg:text-xl font-semibold">1,234</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}