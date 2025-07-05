import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiClock, FiCheck, FiX } = FiIcons;

const Upsell = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const upsellProduct = {
    name: "Bônus Exclusivo: Templates Prontos",
    originalPrice: 197.00,
    discountPrice: 47.00,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    benefits: [
      "50+ Templates profissionais",
      "Layouts responsivos",
      "Fácil personalização",
      "Suporte técnico incluso"
    ]
  };

  const handleAcceptUpsell = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/upsell/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          productId: 'upsell-templates'
        }),
      });

      if (response.ok) {
        navigate('/payment/success', { state: { orderId } });
      }
    } catch (error) {
      console.error('Error processing upsell:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineUpsell = () => {
    navigate(`/product/access/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">
              🎉 Oferta Especial Só Para Você!
            </h1>
            <p className="text-purple-100">
              Aproveite este desconto exclusivo antes que expire
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 mb-8">
              <div className="flex-shrink-0 mb-4 lg:mb-0">
                <img
                  src={upsellProduct.image}
                  alt={upsellProduct.name}
                  className="w-full lg:w-48 h-32 lg:h-36 object-cover rounded-xl"
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {upsellProduct.name}
                </h2>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-gray-500 line-through text-lg">
                    R$ {upsellProduct.originalPrice.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    R$ {upsellProduct.discountPrice.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    76% OFF
                  </div>
                </div>

                <div className="space-y-2">
                  {upsellProduct.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiClock} className="w-5 h-5 text-red-600" />
                <span className="text-red-800 dark:text-red-200 font-medium">
                  Esta oferta expira em 5 minutos!
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={handleAcceptUpsell}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                    <span>Sim, Quero Adicionar ao Meu Pedido!</span>
                  </span>
                )}
              </motion.button>

              <button
                onClick={handleDeclineUpsell}
                className="w-full py-3 px-6 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
                <span>Não, Continuar Sem o Bônus</span>
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                💳 Será cobrado no mesmo cartão usado na compra anterior
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upsell;