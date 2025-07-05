import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import SafeIcon from './SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiCreditCard, FiSmartphone, FiDollarSign, FiUser, FiMail, 
  FiPhone, FiTag, FiLock, FiFileText, FiCheckCircle, FiCopy, FiShield
} = FiIcons;

const CheckoutForm = ({ product, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emailConfirm: '',
    phone: '',
    document: '',
    paymentMethod: 'credit_card',
    coupon: '',
    orderbumpAccepted: false,
    // Dados do cartão
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    cardInstallments: 1
  });

  const [errors, setErrors] = useState({});
  const [couponApplied, setCouponApplied] = useState(false);
  const [showPixQR, setShowPixQR] = useState(false);
  const [pixData, setPixData] = useState(null);

  const paymentMethods = [
    { 
      id: 'credit_card', 
      name: 'Cartão de Crédito', 
      icon: FiCreditCard,
      description: 'Aprovação instantânea'
    },
    { 
      id: 'pix', 
      name: 'PIX', 
      icon: FiSmartphone,
      description: 'Aprovação em até 2 horas'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: FiDollarSign,
      description: 'Pague com sua conta PayPal'
    }
  ];

  const installmentOptions = [
    { value: 1, label: 'À vista - Sem juros' },
    { value: 2, label: '2x - Sem juros' },
    { value: 3, label: '3x - Sem juros' },
    { value: 6, label: '6x - Sem juros' },
    { value: 12, label: '12x - Sem juros' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatDocument = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatCardExpiry = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.replace(/(\d{2})(\d{2})/, '$1/$2');
    }
    return numbers;
  };

  const applyCoupon = async () => {
    if (!formData.coupon.trim()) return;

    try {
      // Simular validação de cupom
      if (formData.coupon.toLowerCase() === product.coupon_code?.toLowerCase()) {
        setCouponApplied(true);
        setErrors(prev => ({ ...prev, coupon: '' }));
      } else {
        setErrors(prev => ({
          ...prev,
          coupon: 'Cupom inválido ou expirado'
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        coupon: 'Erro ao validar cupom'
      }));
    }
  };

  const generatePixPayment = async () => {
    try {
      setShowPixQR(true);
      // Simular geração do PIX
      const pixCode = `00020126580014br.gov.bcb.pix0136${Date.now()}@exemplo.com.br5204000053039865802BR5915Sua Empresa6009SAO PAULO61080540900062070503***6304`;
      setPixData({
        qrCode: pixCode,
        amount: calculateFinalPrice()
      });
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
    }
  };

  const calculateFinalPrice = () => {
    let price = product.price;
    
    if (couponApplied && product.coupon_discount) {
      price = price * (1 - product.coupon_discount / 100);
    }
    
    if (formData.orderbumpAccepted && product.orderbump_enabled) {
      price += product.orderbump_price;
    }
    
    return price;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (formData.email !== formData.emailConfirm) {
      newErrors.emailConfirm = 'E-mails não coincidem';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.document.trim()) newErrors.document = 'CPF/CNPJ é obrigatório';

    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número do cartão é obrigatório';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Validade é obrigatória';
      if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV é obrigatório';
      if (!formData.cardName.trim()) newErrors.cardName = 'Nome no cartão é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (formData.paymentMethod === 'pix') {
      await generatePixPayment();
      return;
    }

    await onSubmit({
      ...formData,
      finalAmount: calculateFinalPrice()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">
          🔒 Checkout Seguro
        </h2>
        <p className="text-primary-100">
          Seus dados estão protegidos com criptografia SSL
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              📋 Seus Dados
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUser} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite seu nome completo"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPF/CNPJ *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiFileText} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="document"
                    value={formData.document}
                    onChange={(e) => {
                      const formatted = formatDocument(e.target.value);
                      setFormData(prev => ({ ...prev, document: formatted }));
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.document ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000.000.000-00"
                  />
                  {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-mail *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiMail} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar E-mail *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiMail} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="emailConfirm"
                    value={formData.emailConfirm}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.emailConfirm ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirme seu e-mail"
                  />
                  {errors.emailConfirm && <p className="text-red-500 text-sm mt-1">{errors.emailConfirm}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefone/WhatsApp *
              </label>
              <div className="relative">
                <SafeIcon icon={FiPhone} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setFormData(prev => ({ ...prev, phone: formatted }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Cupom de Desconto */}
          {product.coupon_code && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                🎟️ Cupom de Desconto
              </h3>
              
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <SafeIcon icon={FiTag} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="coupon"
                    value={formData.coupon}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.coupon ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite seu cupom"
                  />
                  {errors.coupon && <p className="text-red-500 text-sm mt-1">{errors.coupon}</p>}
                </div>
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponApplied}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    couponApplied
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-secondary-600 text-white hover:bg-secondary-700'
                  }`}
                >
                  {couponApplied ? 'Aplicado!' : 'Aplicar'}
                </button>
              </div>
              
              {couponApplied && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Cupom aplicado! Desconto de {product.coupon_discount}%
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Order Bump */}
          {product.orderbump_enabled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-2 border-dashed border-yellow-300 dark:border-yellow-700 rounded-lg p-6"
            >
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  name="orderbumpAccepted"
                  checked={formData.orderbumpAccepted}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 text-primary-600 border-2 border-yellow-400 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      OFERTA ESPECIAL
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Adicione agora e economize!
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {product.orderbump_product}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Adicione este bônus exclusivo ao seu pedido por apenas:
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-green-600">
                      R$ {product.orderbump_price?.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm text-gray-500">
                      (valor original: R$ {(product.orderbump_price * 2)?.toFixed(2).replace('.', ',')})
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Formas de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              💳 Como você quer pagar?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.paymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <SafeIcon 
                      icon={method.icon} 
                      className={`w-6 h-6 ${
                        formData.paymentMethod === method.id 
                          ? 'text-primary-600' 
                          : 'text-gray-400'
                      }`} 
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {method.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {method.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Detalhes do Cartão */}
          <AnimatePresence>
            {formData.paymentMethod === 'credit_card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  💳 Dados do Cartão
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número do Cartão
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiCreditCard} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setFormData(prev => ({ ...prev, cardNumber: formatted }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Validade
                    </label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        const formatted = formatCardExpiry(e.target.value);
                        setFormData(prev => ({ ...prev, cardExpiry: formatted }));
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                    {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.cardCvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.cardName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome como no cartão"
                  />
                  {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Parcelas
                  </label>
                  <select
                    name="cardInstallments"
                    value={formData.cardInstallments}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {installmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PIX QR Code */}
          <AnimatePresence>
            {showPixQR && formData.paymentMethod === 'pix' && pixData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center"
              >
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  📱 Pague com PIX
                </h4>
                
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <QRCode 
                    value={pixData.qrCode}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Escaneie o QR Code com seu app do banco ou copie o código PIX
                </p>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
                  <p className="text-xs font-mono break-all text-gray-700 dark:text-gray-300">
                    {pixData.qrCode.substring(0, 100)}...
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(pixData.qrCode)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                >
                  <SafeIcon icon={FiCopy} className="w-4 h-4" />
                  <span>Copiar Código PIX</span>
                </button>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Valor: <span className="font-bold">R$ {pixData.amount.toFixed(2).replace('.', ',')}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resumo do Pedido */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              📊 Resumo do Pedido
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Produto:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              {couponApplied && product.coupon_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto ({product.coupon_discount}%):</span>
                  <span>-R$ {(product.price * product.coupon_discount / 100).toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              
              {formData.orderbumpAccepted && product.orderbump_enabled && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{product.orderbump_product}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    R$ {product.orderbump_price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}
              
              <hr className="border-gray-200 dark:border-gray-600" />
              
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-primary-600">
                  R$ {calculateFinalPrice().toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Botão de Finalizar */}
          {!showPixQR && (
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all shadow-lg hover:shadow-xl ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processando...
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiLock} className="w-5 h-5" />
                  <span>
                    {formData.paymentMethod === 'pix' ? 'Gerar PIX' : 'Finalizar Compra'}
                    {' - R$ ' + calculateFinalPrice().toFixed(2).replace('.', ',')}
                  </span>
                </span>
              )}
            </motion.button>
          )}

          {/* Segurança */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiLock} className="w-4 h-4" />
                <span>Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiShield} className="w-4 h-4" />
                <span>SSL Criptografado</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CheckoutForm;