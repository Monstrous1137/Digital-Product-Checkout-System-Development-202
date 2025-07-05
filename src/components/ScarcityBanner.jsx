import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiAlertTriangle, FiFire } = FiIcons;

const ScarcityBanner = ({ 
  message = "🔥 OFERTA ESPECIAL TERMINA EM", 
  timeInMinutes = 10,
  enabled = true 
}) => {
  const [timeLeft, setTimeLeft] = useState(timeInMinutes * 60);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (!enabled || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, enabled]);

  useEffect(() => {
    if (timeLeft <= 300) { // Último 5 minutos
      setIsBlinking(true);
    }
  }, [timeLeft]);

  if (!enabled || timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-4 px-4 shadow-lg ${
        isBlinking ? 'animate-pulse' : ''
      }`}
    >
      {/* Efeito de fundo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 opacity-90"></div>
      
      {/* Padrão de pontos */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative z-10 flex items-center justify-center space-x-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: isBlinking ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            duration: isBlinking ? 0.5 : 2, 
            repeat: Infinity 
          }}
        >
          <SafeIcon icon={FiFire} className="w-6 h-6 text-yellow-300" />
        </motion.div>
        
        <span className="font-bold text-lg md:text-xl text-center">
          {message}
        </span>
        
        <div className="flex items-center space-x-2">
          <div className="bg-black bg-opacity-30 px-4 py-2 rounded-lg border border-white border-opacity-20">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiClock} className="w-5 h-5" />
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
                  <div className="text-2xl font-mono font-bold leading-none">
                    {minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs opacity-80">MIN</div>
                </div>
                <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
                  <div className="text-2xl font-mono font-bold leading-none">
                    {seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs opacity-80">SEG</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ 
            rotate: [0, -10, 10, 0],
            scale: isBlinking ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            duration: isBlinking ? 0.5 : 2, 
            repeat: Infinity,
            delay: 0.5
          }}
        >
          <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-yellow-300" />
        </motion.div>
      </div>

      {/* Efeito de borda inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-red-400"></div>
    </motion.div>
  );
};

export default ScarcityBanner;