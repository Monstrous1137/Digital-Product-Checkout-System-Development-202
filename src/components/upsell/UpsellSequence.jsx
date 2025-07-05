import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UpsellCard from './UpsellCard';
import { useABTest } from '../optimization/ABTestProvider';

const UpsellSequence = ({ orderData, onComplete, onAccept }) => {
  const [currentUpsellIndex, setCurrentUpsellIndex] = useState(0);
  const [acceptedUpsells, setAcceptedUpsells] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getVariant, trackEvent } = useABTest();

  // Upsell sequence based on original purchase
  const getUpsellSequence = (originalProduct) => {
    const baseSequence = [
      {
        id: 'template-pack',
        name: 'Pack de Templates Premium',
        description: 'Mais de 100 templates profissionais para acelerar seus projetos',
        originalPrice: 197.00,
        price: 47.00,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        benefits: [
          '100+ Templates responsivos',
          'Designs modernos e profissionais',
          'Fácil personalização',
          'Suporte técnico incluso',
          'Atualizações gratuitas',
          'Licença comercial'
        ],
        valueProposition: 'Economize centenas de horas de trabalho com templates prontos para usar',
        socialProof: {
          rating: 4.9,
          reviews: 1247,
          testimonial: 'Estes templates me pouparam semanas de trabalho! Excelente qualidade.'
        },
        timerMinutes: 10
      },
      {
        id: 'consulting-session',
        name: 'Consultoria Personalizada 1:1',
        description: 'Sessão de 60 minutos com especialista para acelerar seus resultados',
        originalPrice: 297.00,
        price: 97.00,
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
        benefits: [
          'Consultoria 1:1 personalizada',
          'Análise completa do seu projeto',
          'Estratégias específicas para seu caso',
          'Plano de ação detalhado',
          'Gravação da sessão',
          'Material de apoio exclusivo'
        ],
        valueProposition: 'Acelere seus resultados com orientação especializada',
        socialProof: {
          rating: 5.0,
          reviews: 89,
          testimonial: 'A consultoria mudou completamente minha abordagem. Resultados incríveis!'
        },
        timerMinutes: 7
      },
      {
        id: 'automation-tools',
        name: 'Kit de Automação Completo',
        description: 'Ferramentas e scripts para automatizar seus processos',
        originalPrice: 147.00,
        price: 37.00,
        image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop',
        benefits: [
          'Scripts de automação prontos',
          'Integração com principais ferramentas',
          'Documentação completa',
          'Vídeos tutoriais',
          'Suporte técnico',
          'Atualizações constantes'
        ],
        valueProposition: 'Automatize tarefas repetitivas e ganhe tempo para focar no que importa',
        socialProof: {
          rating: 4.8,
          reviews: 234,
          testimonial: 'Economizo 10 horas por semana com essas automações!'
        },
        timerMinutes: 5
      }
    ];

    // Customize sequence based on A/B test variant
    const sequenceVariant = getVariant('upsellSequence');
    
    switch (sequenceVariant) {
      case 'high_value_first':
        return baseSequence.sort((a, b) => b.originalPrice - a.originalPrice);
      case 'low_value_first':
        return baseSequence.sort((a, b) => a.originalPrice - b.originalPrice);
      case 'random':
        return baseSequence.sort(() => Math.random() - 0.5);
      default:
        return baseSequence;
    }
  };

  const [upsellSequence] = useState(() => getUpsellSequence(orderData.product));

  useEffect(() => {
    // Track upsell sequence start
    trackEvent('upsell_sequence_started', {
      order_id: orderData.id,
      sequence_variant: getVariant('upsellSequence'),
      total_upsells: upsellSequence.length
    });
  }, []);

  const handleAcceptUpsell = async (upsell) => {
    setLoading(true);
    
    try {
      // Track upsell acceptance
      trackEvent('upsell_accepted', {
        order_id: orderData.id,
        upsell_id: upsell.id,
        upsell_price: upsell.price,
        sequence_position: currentUpsellIndex + 1
      });

      // Process upsell payment
      const result = await onAccept(upsell);
      
      if (result.success) {
        setAcceptedUpsells(prev => [...prev, upsell]);
        moveToNextUpsell();
      }
    } catch (error) {
      console.error('Error processing upsell:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineUpsell = () => {
    const currentUpsell = upsellSequence[currentUpsellIndex];
    
    // Track upsell decline
    trackEvent('upsell_declined', {
      order_id: orderData.id,
      upsell_id: currentUpsell.id,
      sequence_position: currentUpsellIndex + 1
    });

    moveToNextUpsell();
  };

  const moveToNextUpsell = () => {
    if (currentUpsellIndex < upsellSequence.length - 1) {
      setCurrentUpsellIndex(prev => prev + 1);
    } else {
      // End of sequence
      trackEvent('upsell_sequence_completed', {
        order_id: orderData.id,
        accepted_upsells: acceptedUpsells.length,
        total_upsells: upsellSequence.length,
        total_upsell_value: acceptedUpsells.reduce((sum, upsell) => sum + upsell.price, 0)
      });
      
      onComplete(acceptedUpsells);
    }
  };

  const currentUpsell = upsellSequence[currentUpsellIndex];

  if (!currentUpsell) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Oferta {currentUpsellIndex + 1} de {upsellSequence.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentUpsellIndex + 1) / upsellSequence.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Upsell card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUpsell.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
          >
            <UpsellCard
              upsell={currentUpsell}
              onAccept={handleAcceptUpsell}
              onDecline={handleDeclineUpsell}
              loading={loading}
              timerMinutes={currentUpsell.timerMinutes}
            />
          </motion.div>
        </AnimatePresence>

        {/* Accepted upsells summary */}
        {acceptedUpsells.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
          >
            <h3 className="font-bold text-green-800 dark:text-green-200 mb-4">
              ✅ Produtos Adicionados ao Seu Pedido:
            </h3>
            <div className="space-y-2">
              {acceptedUpsells.map((upsell, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-green-700 dark:text-green-300">{upsell.name}</span>
                  <span className="font-bold text-green-800 dark:text-green-200">
                    R$ {upsell.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
              <div className="border-t border-green-200 dark:border-green-700 pt-2 mt-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-green-800 dark:text-green-200">Total Adicional:</span>
                  <span className="text-green-800 dark:text-green-200">
                    R$ {acceptedUpsells.reduce((sum, upsell) => sum + upsell.price, 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpsellSequence;