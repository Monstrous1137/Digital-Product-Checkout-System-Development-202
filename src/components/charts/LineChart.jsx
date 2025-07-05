import React from 'react';
import { motion } from 'framer-motion';

const LineChart = ({ data, title, color = '#f43f5e', height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        Nenhum dado disponível
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {title}
        </h3>
      )}
      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-200 dark:text-gray-600"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Area under the curve */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={`M 0,100 L ${points} L 100,100 Z`}
            fill={color}
          />

          {/* Main line */}
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 100;
            return (
              <motion.circle
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                className="cursor-pointer hover:r-3 transition-all"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </motion.circle>
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 -ml-8">
          <span>{maxValue}</span>
          <span>{Math.round((maxValue + minValue) / 2)}</span>
          <span>{minValue}</span>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 -mb-6">
          {data.map((item, index) => (
            <span key={index} className={index === 0 ? 'text-left' : index === data.length - 1 ? 'text-right' : 'text-center'}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;