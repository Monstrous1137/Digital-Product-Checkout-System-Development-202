import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiXCircle, FiRefreshCw, FiMessageCircle } = FiIcons;

const PaymentFailed = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiXCircle} className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pagamento Recusado
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Houve um problema com seu pagamento
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Pedido #
            </p>
            <p className="font-mono font-bold text-gray-900 dark:text-white">
              {orderId}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Possíveis motivos:</strong><br />
              • Dados do cartão incorretos<br />
              • Limite insuficiente<br />
              • Cartão bloqueado
            </p>
          </div>

          <Link
            to="/"
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            <span>Tentar Novamente</span>
          </Link>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              💬 Precisa de ajuda? Entre em nosso{' '}
              <a
                href="https://wa.me/5511999999999"
                className="text-primary-600 hover:text-primary-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                suporte via WhatsApp
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;