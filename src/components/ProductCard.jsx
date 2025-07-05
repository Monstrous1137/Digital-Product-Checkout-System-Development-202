import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiStar } = FiIcons;

const ProductCard = ({ product }) => {
  if (!product) return null;

  const installmentPrice = product.price / 12;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="checkout-card rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
        {/* Product Image */}
        <div className="flex-shrink-0 mb-4 lg:mb-0">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=200&fit=crop'}
            alt={product.name}
            className="w-full lg:w-48 h-32 lg:h-36 object-cover rounded-xl"
          />
        </div>
        
        {/* Product Info */}
        <div className="flex-1">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h2>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <SafeIcon key={i} icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              (4.9) • 1,247 avaliações
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-3xl font-bold text-primary-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              ou 12x de R$ {installmentPrice.toFixed(2).replace('.', ',')}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
            <SafeIcon icon={FiCheck} className="w-4 h-4" />
            <span>Acesso imediato após a compra</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 mt-1">
            <SafeIcon icon={FiCheck} className="w-4 h-4" />
            <span>Garantia de 7 dias</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;