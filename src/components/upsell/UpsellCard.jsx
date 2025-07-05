import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiX, FiClock, FiZap, FiGift, FiTrendingUp, FiStar } = FiIcons;

const UpsellCard = ({ upsell, onAccept, onDecline, loading, timerMinutes = 5 }) => {
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline(); // Auto-decline when timer expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start blinking when less than 1 minute left
    if (timeLeft <= 60) {
      setIsBlinking(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft, onDecline]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const discountPercentage = Math.round(((upsell.originalPrice - upsell.price) / upsell.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto"
    >
      {/* Header with urgency */}
      <div className={`bg-gradient-to-r from-red-600 to-red-700 text-white p-4 text-center ${isBlinking ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <SafeIcon icon={FiClock} className="w-5 h-5" />
          <span className="font-bold text-lg">
            OFERTA EXPIRA EM: {formatTime(timeLeft)}
          </span>
        </div>
        <p className="text-red-100 text-sm">
          Esta é uma oferta exclusiva de uma única vez!
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm">
            🎉 OFERTA ESPECIAL ÚNICA
          </div>
        </div>

        {/* Product showcase */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 mb-8">
          <div className="flex-shrink-0 mb-4 lg:mb-0">
            <img
              src={upsell.image}
              alt={upsell.name}
              className="w-full lg:w-48 h-32 lg:h-36 object-cover rounded-xl shadow-lg"
            />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {upsell.name}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {upsell.description}
            </p>

            {/* Price section */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-gray-500 line-through text-lg">
                R$ {upsell.originalPrice.toFixed(2).replace('.', ',')}
              </div>
              <div className="text-3xl font-bold text-green-600">
                R$ {upsell.price.toFixed(2).replace('.', ',')}
              </div>
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                {discountPercentage}% OFF
              </div>
            </div>

            {/* Value proposition */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <SafeIcon icon={FiZap} className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800 dark:text-green-200">
                  Valor Incrível: Economia de R$ {(upsell.originalPrice - upsell.price).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                {upsell.valueProposition}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <SafeIcon icon={FiGift} className="w-5 h-5 mr-2 text-purple-600" />
            O que você vai receber:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upsell.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        {upsell.socialProof && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-blue-800 dark:text-blue-200">
                Avaliação dos Clientes
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon key={i} icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {upsell.socialProof.rating}/5 ({upsell.socialProof.reviews} avaliações)
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 italic">
              "{upsell.socialProof.testimonial}"
            </p>
          </div>
        )}

        {/* Urgency reasons */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ Por que esta oferta é única?
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Desconto exclusivo apenas para clientes recentes</li>
            <li>• Oferta válida apenas nesta sessão</li>
            <li>• Não será repetida no futuro</li>
            <li>• Preço especial por tempo limitado</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <motion.button
            onClick={() => onAccept(upsell)}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all shadow-lg hover:shadow-xl ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processando...
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiZap} className="w-5 h-5" />
                <span>SIM! Quero Adicionar por R$ {upsell.price.toFixed(2).replace('.', ',')}</span>
              </span>
            )}
          </motion.button>

          <button
            onClick={onDecline}
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          >
            Não, obrigado. Continuar sem esta oferta.
          </button>
        </div>

        {/* Payment info */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            💳 Será cobrado no mesmo cartão usado na compra anterior
          </p>
          <p>
            🔒 Pagamento 100% seguro e protegido
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default UpsellCard;