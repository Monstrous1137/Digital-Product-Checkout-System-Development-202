import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiPackage, FiShoppingCart, FiBarChart3, FiSettings, FiLogOut, FiSun, FiMoon, FiMenu, FiX, FiUsers } = FiIcons;

const AdminLayout = ({ children }) => {
  const { logout, hasPermission } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', permission: 'dashboard.view' },
    { path: '/admin/products', icon: FiPackage, label: 'Produtos', permission: 'products.view' },
    { path: '/admin/orders', icon: FiShoppingCart, label: 'Pedidos', permission: 'orders.view' },
    { path: '/admin/metrics', icon: FiBarChart3, label: 'Métricas', permission: 'metrics.view' },
    { path: '/admin/users', icon: FiUsers, label: 'Usuários', permission: 'users.view' },
    { path: '/admin/settings', icon: FiSettings, label: 'Configurações', permission: 'settings.view' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Checkout Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 border-r-2 border-primary-600'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <SafeIcon icon={FiMenu} className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Sistema de Checkout Digital v2.0
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminLayout;