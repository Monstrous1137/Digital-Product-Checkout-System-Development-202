import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../components/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiShoppingCart, FiPercent } = FiIcons;

const AdminMetrics = () => {
  const [metrics, setMetrics] = useState({
    revenue: {
      today: 0,
      yesterday: 0,
      week: 0,
      lastWeek: 0,
      month: 0,
      lastMonth: 0
    },
    orders: {
      today: 0,
      yesterday: 0,
      week: 0,
      lastWeek: 0,
      month: 0,
      lastMonth: 0
    },
    customers: {
      today: 0,
      yesterday: 0,
      week: 0,
      lastWeek: 0,
      month: 0,
      lastMonth: 0
    },
    conversion: {
      today: 0,
      yesterday: 0,
      week: 0,
      lastWeek: 0,
      month: 0,
      lastMonth: 0
    },
    topProducts: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (value) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const MetricCard = ({ title, current, previous, icon, color, isPercentage = false, isCurrency = false }) => {
    const change = getPercentageChange(current, previous);
    const isPositive = change >= 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isCurrency ? formatCurrency(current) : 
               isPercentage ? `${current.toFixed(1)}%` : 
               current}
            </p>
            <div className="flex items-center mt-2">
              <SafeIcon 
                icon={isPositive ? FiTrendingUp : FiTrendingDown} 
                className={`w-4 h-4 mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} 
              />
              <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs período anterior
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <SafeIcon icon={icon} className="w-6 h-6 text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  const periods = [
    { key: 'today', label: 'Hoje', compareKey: 'yesterday' },
    { key: 'week', label: 'Semana', compareKey: 'lastWeek' },
    { key: 'month', label: 'Mês', compareKey: 'lastMonth' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Métricas
        </h1>
        <div className="flex space-x-2">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Receita"
          current={metrics.revenue[selectedPeriod]}
          previous={metrics.revenue[periods.find(p => p.key === selectedPeriod)?.compareKey]}
          icon={FiDollarSign}
          color="bg-green-500"
          isCurrency={true}
        />
        <MetricCard
          title="Pedidos"
          current={metrics.orders[selectedPeriod]}
          previous={metrics.orders[periods.find(p => p.key === selectedPeriod)?.compareKey]}
          icon={FiShoppingCart}
          color="bg-blue-500"
        />
        <MetricCard
          title="Clientes"
          current={metrics.customers[selectedPeriod]}
          previous={metrics.customers[periods.find(p => p.key === selectedPeriod)?.compareKey]}
          icon={FiUsers}
          color="bg-purple-500"
        />
        <MetricCard
          title="Conversão"
          current={metrics.conversion[selectedPeriod]}
          previous={metrics.conversion[periods.find(p => p.key === selectedPeriod)?.compareKey]}
          icon={FiPercent}
          color="bg-orange-500"
          isPercentage={true}
        />
      </div>

      {/* Charts and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Produtos Mais Vendidos
          </h3>
          <div className="space-y-4">
            {metrics.topProducts.length > 0 ? (
              metrics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.sales} vendas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                Nenhum dado disponível
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {metrics.recentActivity.length > 0 ? (
              metrics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                Nenhuma atividade recente
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Resumo Geral
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(metrics.revenue.today + metrics.revenue.week + metrics.revenue.month)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receita Total
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.orders.today + metrics.orders.week + metrics.orders.month}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total de Pedidos
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {metrics.customers.today + metrics.customers.week + metrics.customers.month}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total de Clientes
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminMetrics;