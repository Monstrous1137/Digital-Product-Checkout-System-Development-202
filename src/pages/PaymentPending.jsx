import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiRefreshCw } = FiIcons;

const PaymentPending = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiClock} className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pagamento Pendente
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Aguardando confirmação do pagamento
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

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>PIX:</strong> O pagamento pode levar até 2 horas para ser confirmado.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            <span>Verificar Status</span>
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              📧 Você receberá um e-mail quando o pagamento for confirmado
            </p>
            <p>
              💬 Dúvidas? Entre em nosso{' '}
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

export default PaymentPending;