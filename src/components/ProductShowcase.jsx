import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiCheck, FiUsers, FiPlay, FiDownload, FiShield } = FiIcons;

const ProductShowcase = ({ product }) => {
  if (!product) return null;

  const installmentPrice = product.price / (product.installments || 12);
  const discountPrice = product.coupon_discount ? 
    product.price * (1 - product.coupon_discount / 100) : 
    product.price;

  const benefits = [
    "✅ Acesso imediato após a compra",
    "✅ Garantia de 7 dias ou seu dinheiro de volta",
    "✅ Suporte técnico incluso",
    "✅ Atualizações gratuitas por 1 ano",
    "✅ Certificado de conclusão",
    "✅ Acesso vitalício ao conteúdo"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Cabeçalho com badge */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            ⚡ ACESSO IMEDIATO
          </span>
        </div>
        
        {/* Imagem do produto */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=600&fit=crop'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white bg-opacity-90 rounded-full p-6 cursor-pointer shadow-2xl"
            >
              <SafeIcon icon={FiPlay} className="w-12 h-12 text-primary-600" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Título e avaliações */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {product.name}
          </h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <SafeIcon key={i} icon={FiStar} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              4.9 (2,847 avaliações)
            </span>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <SafeIcon icon={FiUsers} className="w-4 h-4" />
              <span>15,234 alunos</span>
            </div>
          </div>
        </div>

        {/* Preços */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              {product.coupon_discount > 0 && (
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-gray-500 line-through text-xl">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-bold">
                    -{product.coupon_discount}% OFF
                  </span>
                </div>
              )}
              
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                R$ {discountPrice.toFixed(2).replace('.', ',')}
              </div>
              
              <div className="text-lg text-gray-600 dark:text-gray-400">
                ou <span className="font-bold text-green-600">
                  {product.installments || 12}x de R$ {installmentPrice.toFixed(2).replace('.', ',')}
                </span> sem juros
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                  <SafeIcon icon={FiShield} className="w-5 h-5" />
                  <span className="font-bold">GARANTIA DE 7 DIAS</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  100% do seu dinheiro de volta
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefícios */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            O que você vai receber:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {benefit.replace('✅ ', '')}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Estatísticas sociais */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">15K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Alunos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">4.9</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avaliação</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">24h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Suporte</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductShowcase;