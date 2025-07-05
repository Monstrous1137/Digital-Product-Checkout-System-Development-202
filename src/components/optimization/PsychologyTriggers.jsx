import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useABTest } from './ABTestProvider';
import SafeIcon from '../SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiUsers, FiTrendingUp, FiAlert, FiGift, FiZap } = FiIcons;

const PsychologyTriggers = ({ product, onTriggerActivated }) => {
  const { getVariant, trackEvent } = useABTest();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showScrollTrigger, setShowScrollTrigger] = useState(false);
  const [viewingTime, setViewingTime] = useState(0);

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    // Viewing time tracker
    const viewTimer = setInterval(() => {
      setViewingTime(prev => prev + 1);
    }, 1000);

    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !showExitIntent && viewingTime > 30) {
        setShowExitIntent(true);
        trackEvent('exit_intent_triggered', {
          viewing_time: viewingTime,
          scroll_position: window.scrollY
        });
      }
    };

    // Scroll trigger
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50 && !showScrollTrigger && viewingTime > 60) {
        setShowScrollTrigger(true);
        trackEvent('scroll_trigger_activated', {
          scroll_percent: scrollPercent,
          viewing_time: viewingTime
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      clearInterval(viewTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showExitIntent, showScrollTrigger, viewingTime, trackEvent]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExitIntentClose = () => {
    setShowExitIntent(false);
    trackEvent('exit_intent_dismissed');
  };

  const handleExitIntentAccept = () => {
    setShowExitIntent(false);
    trackEvent('exit_intent_accepted');
    onTriggerActivated?.('exit_intent_discount');
  };

  const urgencyMessages = [
    "⚡ Apenas hoje com este desconto!",
    "🔥 Últimas horas desta promoção!",
    "⏰ Oferta expira em breve!",
    "🎯 Preço promocional por tempo limitado!"
  ];

  const socialProofMessages = [
    "👥 Mais de 15.000 pessoas já compraram",
    "🏆 Produto #1 em vendas desta semana",
    "⭐ 4.9/5 estrelas - Mais de 2.000 avaliações",
    "🚀 +300% de crescimento em vendas este mês"
  ];

  const [currentUrgency, setCurrentUrgency] = useState(0);
  const [currentSocial, setCurrentSocial] = useState(0);

  useEffect(() => {
    const urgencyInterval = setInterval(() => {
      setCurrentUrgency(prev => (prev + 1) % urgencyMessages.length);
    }, 5000);

    const socialInterval = setInterval(() => {
      setCurrentSocial(prev => (prev + 1) % socialProofMessages.length);
    }, 7000);

    return () => {
      clearInterval(urgencyInterval);
      clearInterval(socialInterval);
    };
  }, []);

  return (
    <>
      {/* Floating Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow-2xl"
      >
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiClock} className="w-5 h-5" />
          <div className="text-center">
            <div className="text-2xl font-bold font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs opacity-90">
              para garantir o desconto
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rotating Urgency Messages */}
      <motion.div
        key={currentUrgency}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg text-center font-medium shadow-lg"
      >
        {urgencyMessages[currentUrgency]}
      </motion.div>

      {/* Social Proof Carousel */}
      <motion.div
        key={currentSocial}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg text-center text-green-800 dark:text-green-200"
      >
        {socialProofMessages[currentSocial]}
      </motion.div>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiAlert} className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Espere! Não perca esta oportunidade
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Que tal um desconto especial de 15% para você decidir agora?
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <SafeIcon icon={FiGift} className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    DESCONTO ESPECIAL
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  15% OFF
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cupom: FIQUEAQUI15
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleExitIntentAccept}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Sim, quero o desconto!
                </button>
                <button
                  onClick={handleExitIntentClose}
                  className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 py-2"
                >
                  Não, obrigado
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                * Oferta válida apenas para esta sessão
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Trigger Notification */}
      <AnimatePresence>
        {showScrollTrigger && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-2xl max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiZap} className="w-6 h-6" />
              <div>
                <p className="font-bold">Está gostando do que vê?</p>
                <p className="text-sm opacity-90">
                  Aproveite nossa oferta especial!
                </p>
              </div>
              <button
                onClick={() => setShowScrollTrigger(false)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (viewingTime / 300) * 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </>
  );
};

export default PsychologyTriggers;