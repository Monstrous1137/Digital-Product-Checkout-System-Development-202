import React, { createContext, useContext, useState, useEffect } from 'react';

const ABTestContext = createContext();

export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};

export const ABTestProvider = ({ children }) => {
  const [experiments, setExperiments] = useState({});
  const [userVariants, setUserVariants] = useState({});
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));

  // Active experiments configuration
  const activeExperiments = {
    checkoutLayout: {
      id: 'checkout_layout_v2',
      variants: ['control', 'single_column', 'minimal'],
      weights: [0.4, 0.3, 0.3],
      enabled: true
    },
    scarcityMessage: {
      id: 'scarcity_message_v1',
      variants: ['timer_only', 'stock_limited', 'social_proof'],
      weights: [0.33, 0.33, 0.34],
      enabled: true
    },
    buttonText: {
      id: 'button_text_v1',
      variants: ['finalizar_compra', 'garantir_acesso', 'comprar_agora'],
      weights: [0.33, 0.33, 0.34],
      enabled: true
    },
    priceDisplay: {
      id: 'price_display_v1',
      variants: ['standard', 'comparison', 'savings_highlight'],
      weights: [0.33, 0.33, 0.34],
      enabled: true
    },
    testimonials: {
      id: 'testimonials_v1',
      variants: ['none', 'floating', 'sidebar'],
      weights: [0.25, 0.35, 0.4],
      enabled: true
    }
  };

  useEffect(() => {
    initializeExperiments();
  }, []);

  const initializeExperiments = () => {
    const savedVariants = localStorage.getItem('ab_test_variants');
    let variants = {};

    if (savedVariants) {
      variants = JSON.parse(savedVariants);
    }

    // Assign variants for new experiments
    Object.entries(activeExperiments).forEach(([key, experiment]) => {
      if (!variants[key] && experiment.enabled) {
        variants[key] = selectVariant(experiment);
      }
    });

    setUserVariants(variants);
    localStorage.setItem('ab_test_variants', JSON.stringify(variants));
  };

  const selectVariant = (experiment) => {
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < experiment.variants.length; i++) {
      cumulative += experiment.weights[i];
      if (random < cumulative) {
        return experiment.variants[i];
      }
    }

    return experiment.variants[0];
  };

  const getVariant = (experimentKey) => {
    return userVariants[experimentKey] || 'control';
  };

  const trackEvent = async (eventName, properties = {}) => {
    const eventData = {
      sessionId,
      eventName,
      timestamp: new Date().toISOString(),
      variants: userVariants,
      properties
    };

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const trackConversion = async (conversionData) => {
    await trackEvent('conversion', conversionData);
  };

  return (
    <ABTestContext.Provider value={{
      getVariant,
      trackEvent,
      trackConversion,
      sessionId,
      userVariants
    }}>
      {children}
    </ABTestContext.Provider>
  );
};