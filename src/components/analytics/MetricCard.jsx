import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown } = FiIcons;

const MetricCard = ({ 
  title, 
  value, 
  previousValue, 
  icon, 
  color = 'text-primary-600',
  bgColor = 'bg-primary-100 dark:bg-primary-900',
  format = 'number',
  suffix = '',
  prefix = ''
}) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return `R$ ${val.toFixed(2).replace('.', ',')}`;
    }
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    return val.toLocaleString();
  };

  const calculateChange = () => {
    if (!previousValue || previousValue === 0) return 0;
    return ((value - previousValue) / previousValue) * 100;
  };

  const change = calculateChange();
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-1">
            {prefix && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {prefix}
              </span>
            )}
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatValue(value)}
            </p>
            {suffix && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {suffix}
              </span>
            )}
          </div>
          
          {previousValue !== undefined && (
            <div className="flex items-center mt-2">
              <SafeIcon
                icon={isPositive ? FiTrendingUp : FiTrendingDown}
                className={`w-4 h-4 mr-1 ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              />
              <span
                className={`text-sm ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs período anterior
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${bgColor}`}>
          <SafeIcon icon={icon} className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;