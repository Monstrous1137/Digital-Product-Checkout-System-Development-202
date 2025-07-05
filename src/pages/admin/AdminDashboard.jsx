import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../components/SafeIcon';
import MetricCard from '../../components/analytics/MetricCard';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';
import * as FiIcons from 'react-icons/fi';

const {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiClock,
  FiEye,
  FiArrowUpRight,
  FiArrowDownRight,
  FiActivity,
  FiTarget,
  FiPercent,
  FiGlobe
} = FiIcons;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    todaySales: 0,
    weekSales: 0,
    monthSales: 0,
    avgOrderValue: 0,
    totalViews: 0,
    bounceRate: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [ordersByMethod, setOrdersByMethod] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

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
        
        // Mock chart data - replace with real data
        setSalesData([
          { label: 'Seg', value: 1250 },
          { label: 'Ter', value: 1890 },
          { label: 'Qua', value: 2340 },
          { label: 'Qui', value: 1980 },
          { label: 'Sex', value: 2650 },
          { label: 'Sáb', value: 3200 },
          { label: 'Dom', value: 2100 }
        ]);

        setOrdersByMethod([
          { label: 'Cartão', value: 245 },
          { label: 'PIX', value: 189 },
          { label: 'PayPal', value: 67 }
        ]);

        setTopProducts([
          { label: 'Curso Marketing', value: 145 },
          { label: 'E-book Premium', value: 89 },
          { label: 'Consultoria', value: 34 }
        ]);
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
      value: stats.totalSales,
      previousValue: stats.totalSales * 0.85,
      icon: FiDollarSign,
      color: 'text-white',
      bgColor: 'bg-green-500',
      format: 'currency'
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders,
      previousValue: stats.totalOrders * 0.92,
      icon: FiShoppingCart,
      color: 'text-white',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Clientes',
      value: stats.totalCustomers,
      previousValue: stats.totalCustomers * 0.88,
      icon: FiUsers,
      color: 'text-white',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Taxa de Conversão',
      value: stats.conversionRate,
      previousValue: stats.conversionRate * 0.95,
      icon: FiPercent,
      color: 'text-white',
      bgColor: 'bg-orange-500',
      format: 'percentage'
    },
    {
      title: 'Ticket Médio',
      value: stats.avgOrderValue || 197.50,
      previousValue: (stats.avgOrderValue || 197.50) * 0.91,
      icon: FiTarget,
      color: 'text-white',
      bgColor: 'bg-indigo-500',
      format: 'currency'
    },
    {
      title: 'Visualizações',
      value: stats.totalViews || 15420,
      previousValue: (stats.totalViews || 15420) * 0.87,
      icon: FiEye,
      color: 'text-white',
      bgColor: 'bg-pink-500'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Produto',
      description: 'Criar um novo produto',
      icon: FiShoppingCart,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'Ver Pedidos',
      description: 'Gerenciar pedidos',
      icon: FiActivity,
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      title: 'Métricas',
      description: 'Análises detalhadas',
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      link: '/admin/metrics'
    },
    {
      title: 'Configurações',
      description: 'Ajustar sistema',
      icon: FiGlobe,
      color: 'bg-orange-500',
      link: '/admin/settings'
    }
  ];

  const timeRanges = [
    { value: '24h', label: 'Últimas 24h' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do seu negócio digital
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <SafeIcon icon={FiCalendar} className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((card, index) => (
          <MetricCard
            key={card.title}
            title={card.title}
            value={card.value}
            previousValue={card.previousValue}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
            format={card.format}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              to={action.link}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${action.color} rounded-lg`}>
                    <SafeIcon icon={action.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vendas dos Últimos 7 Dias
            </h3>
            <div className="flex items-center space-x-1 text-green-600">
              <SafeIcon icon={FiArrowUpRight} className="w-4 h-4" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          <BarChart data={salesData} color="#10b981" />
        </motion.div>

        {/* Payment Methods Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Métodos de Pagamento
          </h3>
          <DonutChart data={ordersByMethod} />
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pedidos Recentes
            </h3>
            <Link
              to="/admin/orders"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>Ver todos</span>
              <SafeIcon icon={FiArrowUpRight} className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiShoppingCart} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.productName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      R$ {order.amount.toFixed(2).replace('.', ',')}
                    </p>
                    <p className={`text-sm ${
                      order.status === 'approved' 
                        ? 'text-green-600' 
                        : order.status === 'pending' 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {order.status === 'approved' ? 'Aprovado' : 
                       order.status === 'pending' ? 'Pendente' : 'Recusado'}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiShoppingCart} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhum pedido recente
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Produtos Mais Vendidos
          </h3>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.value} vendas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-green-600">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Desempenho Excelente! 🚀
            </h3>
            <p className="text-primary-100">
              Suas vendas aumentaram 25% este mês. Continue assim!
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">
              R$ {stats.monthSales.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-primary-100 text-sm">
              Vendas este mês
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;