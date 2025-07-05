import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendationEngine } from './RecommendationEngine';
import SafeIcon from '../SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiShoppingCart, FiEye, FiTrendingUp, FiUsers, FiHeart, FiArrowRight } = FiIcons;

const ProductRecommendations = ({ 
  currentProductId = null, 
  title = "Produtos Recomendados", 
  limit = 6,
  layout = "grid", // grid, carousel, list
  showReason = true,
  onProductClick = null,
  className = ""
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadRecommendations();
  }, [currentProductId, limit]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const recs = await recommendationEngine.generateRecommendations(currentProductId, limit);
      setRecommendations(recs);
    } catch (err) {
      setError('Erro ao carregar recomendações');
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    // Track the click
    recommendationEngine.trackProductView(product.id, product);
    
    if (onProductClick) {
      onProductClick(product);
    } else {
      // Default behavior - navigate to product
      window.location.href = `/#/checkout/${product.id}`;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(recommendations.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(recommendations.length / 2)) % Math.ceil(recommendations.length / 2));
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const getReasonIcon = (reason) => {
    if (reason.includes('comprou')) return FiUsers;
    if (reason.includes('Similar')) return FiEye;
    if (reason.includes('preferências')) return FiHeart;
    if (reason.includes('alta')) return FiTrendingUp;
    return FiStar;
  };

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => handleProductClick(product)}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
          ⭐ {product.rating}
        </div>
        {showReason && (
          <div className="absolute bottom-3 left-3 bg-primary-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <SafeIcon icon={getReasonIcon(product.reason)} className="w-3 h-3" />
            <span>{product.reason}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <SafeIcon icon={FiUsers} className="w-4 h-4" />
            <span>{product.salesCount}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <SafeIcon 
                key={i} 
                icon={FiStar} 
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <div className="flex items-center space-x-1 text-primary-600 group-hover:text-primary-700">
            <span className="text-sm font-medium">Ver mais</span>
            <SafeIcon icon={FiArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (layout === "carousel") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <motion.div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {recommendations.map((product, index) => (
              <div key={product.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h2>
        
        <div className="space-y-4">
          {recommendations.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex items-center space-x-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="text-lg font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <SafeIcon 
                          key={i} 
                          icon={FiStar} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {showReason && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <SafeIcon icon={getReasonIcon(product.reason)} className="w-4 h-4" />
                      <span>{product.reason}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 text-primary-600 group-hover:text-primary-700">
                  <span className="text-sm font-medium">Ver mais</span>
                  <SafeIcon icon={FiArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Default grid layout
  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;