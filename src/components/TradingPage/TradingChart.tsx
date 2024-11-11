import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
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
      height: 400,
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
          width: chartContainerRef.current.clientWidth
        });
      }
    };

    window.addEventListener('resize', handleResize);
    chartRef.current = chart;

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="bg-gray-800/30 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          {['1D', '1W', '1M', '3M', 'ALL'].map((period) => (
            <button
              key={period}
              className="px-3 py-1 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}