import React from 'react';
import { motion } from 'framer-motion';

const DonutChart = ({ data, title, size = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        Nenhum dado disponível
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 80;
  const strokeWidth = 20;
  const center = size / 2;

  let cumulativePercentage = 0;

  const colors = [
    '#f43f5e', '#06b6d4', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ef4444', '#84cc16', '#f97316'
  ];

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {title}
        </h3>
      )}
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Chart */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 2.51} 251.2`;
              const strokeDashoffset = -cumulativePercentage * 2.51;
              
              cumulativePercentage += percentage;

              return (
                <motion.circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ strokeDasharray }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <title>{`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}</title>
                </motion.circle>
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {total}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;