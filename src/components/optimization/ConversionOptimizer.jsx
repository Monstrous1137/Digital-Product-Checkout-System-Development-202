import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useABTest } from './ABTestProvider';
import SafeIcon from '../SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiClock, FiTrendingUp, FiStar, FiShield, FiZap } = FiIcons;

const ConversionOptimizer = ({ product, onOptimizationLoad }) => {
  const { getVariant, trackEvent } = useABTest();
  const [socialProof, setSocialProof] = useState({
    recentPurchases: [],
    totalSales: 0,
    activeViewers: 0
  });

  useEffect(() => {
    generateSocialProof();
    const interval = setInterval(generateSocialProof, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const generateSocialProof = () => {
    const names = [
      'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
      'Carlos Ferreira', 'Lucia Martins', 'Rafael Souza', 'Fernanda Lima',
      'Bruno Alves', 'Camila Rocha', 'Diego Pereira', 'Juliana Ribeiro'
    ];

    const cities = [
      'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG',
      'Salvador, BA', 'Brasília, DF', 'Curitiba, PR', 'Recife, PE',
      'Porto Alegre, RS', 'Fortaleza, CE', 'Manaus, AM'
    ];

    const recentPurchases = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: names[Math.floor(Math.random() * names.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      timeAgo: Math.floor(Math.random() * 60) + 1,
      product: product.name
    }));

    setSocialProof({
      recentPurchases,
      totalSales: 15420 + Math.floor(Math.random() * 100),
      activeViewers: 23 + Math.floor(Math.random() * 15)
    });
  };

  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "Empreendedor Digital",
      content: "Este curso mudou completamente minha forma de fazer marketing. Já recuperei o investimento em 2 semanas!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Mariana Silva",
      role: "Consultora de Marketing",
      content: "Conteúdo extremamente prático e direto ao ponto. Recomendo para qualquer pessoa que quer resultados reais.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c3d?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Roberto Santos",
      role: "Dono de E-commerce",
      content: "Aplicando as estratégias do curso, aumentei minhas vendas em 300% em apenas 3 meses. Investimento que vale a pena!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    }
  ];

  const urgencyMessages = {
    timer_only: "⏰ Oferta termina em breve!",
    stock_limited: "🔥 Apenas 7 vagas restantes!",
    social_proof: `👥 ${socialProof.activeViewers} pessoas vendo agora`
  };

  const scarcityVariant = getVariant('scarcityMessage');
  const testimonialsVariant = getVariant('testimonials');

  const handleTestimonialView = (testimonial) => {
    trackEvent('testimonial_viewed', {
      testimonial_author: testimonial.name,
      variant: testimonialsVariant
    });
  };

  return (
    <div className="space-y-6">
      {/* Social Proof Notifications */}
      <AnimatePresence>
        {socialProof.recentPurchases.slice(0, 1).map((purchase) => (
          <motion.div
            key={purchase.id}
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-200 dark:border-gray-700 max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUsers} className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {purchase.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {purchase.city} • há {purchase.timeAgo} min
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Acabou de adquirir este produto
            </p>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Enhanced Scarcity Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-center space-x-4">
          <SafeIcon icon={FiClock} className="w-6 h-6" />
          <span className="font-bold text-lg">
            {urgencyMessages[scarcityVariant]}
          </span>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4 text-center"
      >
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <SafeIcon icon={FiShield} className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Compra Segura
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SSL Certificado
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <SafeIcon icon={FiZap} className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Acesso Imediato
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Em até 5 minutos
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {socialProof.totalSales.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Alunos Satisfeitos
          </p>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      {testimonialsVariant !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${testimonialsVariant === 'floating' ? 'fixed right-4 top-1/2 transform -translate-y-1/2 w-80 z-40' : ''}`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-500 mr-2" />
              O que nossos alunos dizem
            </h3>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-primary-500 pl-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-r-lg transition-colors"
                  onClick={() => handleTestimonialView(testimonial)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <SafeIcon key={i} icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Live Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300">
              {socialProof.activeViewers} pessoas vendo agora
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {socialProof.totalSales.toLocaleString()} vendas realizadas
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConversionOptimizer;