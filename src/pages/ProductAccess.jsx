import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiExternalLink, FiMessageCircle, FiStar } = FiIcons;

const ProductAccess = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderData();
    
    // Fire access pixel
    if (window.gtag) {
      window.gtag('event', 'product_access', {
        order_id: orderId
      });
    }
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiDownload} className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bem-vindo ao seu produto!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Parabéns pela compra! Agora você tem acesso completo ao conteúdo.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📚 Seu Produto Digital
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Produto:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Curso Completo de Marketing Digital
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                    Ativo
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Validade:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Vitalício
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="https://drive.google.com/file/d/example/view"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiExternalLink} className="w-5 h-5" />
                <span>Acessar Conteúdo</span>
              </a>

              <a
                href="https://t.me/+exemplo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiMessageCircle} className="w-5 h-5" />
                <span>Entrar no Grupo VIP</span>
              </a>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                📝 Instruções Importantes:
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Salve este link em seus favoritos</li>
                <li>• Faça backup do conteúdo</li>
                <li>• Entre no grupo VIP para suporte</li>
                <li>• Compartilhe sua experiência conosco</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Gostou do produto? Deixe sua avaliação!
              </p>
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon
                    key={i}
                    icon={FiStar}
                    className="w-6 h-6 text-yellow-400 cursor-pointer hover:text-yellow-500"
                  />
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductAccess;