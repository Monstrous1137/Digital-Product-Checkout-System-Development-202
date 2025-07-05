import React, { createContext, useContext, useState, useEffect } from 'react';

const CheckoutContext = createContext();

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

export const CheckoutProvider = ({ children }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const fetchProduct = async (productId) => {
    setLoading(true);
    try {
      // Mock data para desenvolvimento
      const mockProduct = {
        id: productId || '1',
        name: 'Curso Completo de Marketing Digital',
        price: 197.00,
        image_url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=600&fit=crop',
        installments: 12,
        coupon_code: 'DESCONTO20',
        coupon_discount: 20,
        scarcity_enabled: true,
        scarcity_message: '🔥 OFERTA ESPECIAL TERMINA EM',
        scarcity_time_minutes: 15,
        orderbump_enabled: true,
        orderbump_product: 'E-book Bônus: 50 Templates Prontos',
        orderbump_price: 47.00,
        active: true
      };
      setProduct(mockProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentData) => {
    setLoading(true);
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar dados do pedido
      const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const result = {
        success: true,
        orderNumber,
        status: paymentData.paymentMethod === 'pix' ? 'pending' : 'approved',
        amount: paymentData.finalAmount
      };
      
      setOrderData(result);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <CheckoutContext.Provider value={{
      product,
      loading,
      orderData,
      fetchProduct,
      processPayment,
      setProduct,
      setOrderData
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};