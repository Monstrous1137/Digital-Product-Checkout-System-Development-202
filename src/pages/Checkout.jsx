import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ScarcityBanner from '../components/ScarcityBanner';
import ProductShowcase from '../components/ProductShowcase';
import CheckoutForm from '../components/CheckoutForm';
import { v4 as uuidv4 } from 'uuid';

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const id = productId || '1'; // ID padrão
        
        // Tentar carregar do backend primeiro
        try {
          const response = await axios.get(`/api/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.warn('Backend não disponível, usando dados mock');
          // Dados mock se não conseguir carregar do backend
          setProduct({
            id: '1',
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
          });
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handlePayment = async (paymentData) => {
    setProcessing(true);
    
    try {
      // Gerar número do pedido
      const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular resposta do gateway de pagamento
      let paymentStatus = 'approved';
      if (paymentData.paymentMethod === 'pix') {
        paymentStatus = Math.random() > 0.3 ? 'pending' : 'approved';
      } else if (paymentData.paymentMethod === 'credit_card') {
        paymentStatus = Math.random() > 0.1 ? 'approved' : 'failed';
      }

      // Redirecionar baseado no status
      switch (paymentStatus) {
        case 'approved':
          navigate('/payment/success', {
            state: {
              orderNumber: orderNumber,
              customerName: paymentData.name,
              amount: paymentData.finalAmount
            }
          });
          break;
        case 'pending':
          navigate('/payment/pending', {
            state: {
              orderNumber: orderNumber,
              paymentMethod: paymentData.paymentMethod
            }
          });
          break;
        default:
          navigate('/payment/failed', {
            state: {
              orderNumber: orderNumber
            }
          });
      }
    } catch (error) {
      console.error('Erro no processamento:', error);
      alert('Erro no processamento do pagamento. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Carregando checkout...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Preparando tudo para você
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Banner de Escassez */}
      <ScarcityBanner 
        message={product.scarcity_message}
        timeInMinutes={product.scarcity_time_minutes}
        enabled={product.scarcity_enabled}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Último Passo Para Transformar Sua Vida!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Complete seu pedido abaixo e tenha acesso imediato ao conteúdo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Produto */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProductShowcase product={product} />
            </motion.div>

            {/* Formulário de Checkout */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CheckoutForm 
                product={product}
                onSubmit={handlePayment}
                loading={processing}
              />
            </motion.div>
          </div>

          {/* Garantias e Segurança */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                🛡️ Suas Garantias de Segurança
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    Pagamento 100% Seguro
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Seus dados são protegidos com criptografia SSL de ponta a ponta
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    Acesso Imediato
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Receba o acesso ao conteúdo em até 5 minutos após a aprovação
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    Garantia de 7 Dias
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Se não ficar satisfeito, devolvemos 100% do seu dinheiro
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;