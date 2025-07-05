import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../components/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp, FiCalendar } = FiIcons;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    todaySales: 0,
    weekSales: 0,
    monthSales: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Vendas Totais',
      value: `R$ ${stats.totalSales.toFixed(2).replace('.', ',')}`,
      icon: FiDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders,
      icon: FiShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Clientes',
      value: stats.totalCustomers,
      icon: FiUsers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Conversão',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ];

  const salesPeriods = [
    { label: 'Hoje', value: stats.todaySales },
    { label: 'Semana', value: stats.weekSales },
    { label: 'Mês', value: stats.monthSales }
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
          Dashboard
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <SafeIcon icon={FiCalendar} className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <SafeIcon icon={card.icon} className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales by Period */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vendas por Período
          </h3>
          <div className="space-y-4">
            {salesPeriods.map((period, index) => (
              <div key={period.label} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{period.label}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  R$ {period.value.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pedidos Recentes
          </h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.productName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      R$ {order.amount.toFixed(2).replace('.', ',')}
                    </p>
                    <p className={`text-sm ${
                      order.status === 'approved' ? 'text-green-600' :
                      order.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {order.status === 'approved' ? 'Aprovado' :
                       order.status === 'pending' ? 'Pendente' :
                       'Recusado'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                Nenhum pedido recente
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;