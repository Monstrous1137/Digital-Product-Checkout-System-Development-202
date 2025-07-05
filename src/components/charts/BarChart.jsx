import React from 'react';
import { motion } from 'framer-motion';

const BarChart = ({ data, title, color = '#f43f5e', height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        Nenhum dado disponível
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {title}
        </h3>
      )}
      <div className="relative" style={{ height }}>
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeight}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="w-full rounded-t-lg relative group cursor-pointer"
                    style={{ backgroundColor: color }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.value}
                    </div>
                  </motion.div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center truncate w-full">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;