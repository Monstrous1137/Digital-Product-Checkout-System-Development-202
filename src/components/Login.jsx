import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from './SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiLock, FiEye, FiEyeOff, FiMail, FiShield, FiArrowRight } = FiIcons;

const Login = ({ 
  title = "Bem-vindo de volta!",
  subtitle = "Faça login para acessar sua conta",
  redirectTo = "/",
  showRegister = false,
  variant = "default" // default, admin, customer
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || redirectTo;
      navigate(from, { replace: true });
    }
  }, [user, navigate, redirectTo, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        // Handle registration
        const result = await handleRegister(formData);
        if (result.success) {
          setIsRegisterMode(false);
          setError('');
          // Show success message
        } else {
          setError(result.error || 'Erro ao criar conta');
        }
      } else {
        // Handle login
        const result = await login(formData.email, formData.password);
        if (result.success) {
          const from = location.state?.from?.pathname || redirectTo;
          navigate(from, { replace: true });
        } else {
          setError(result.error || 'Credenciais inválidas');
        }
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    // Mock registration - replace with actual API call
    if (userData.email && userData.password) {
      return { success: true };
    }
    return { success: false, error: 'Dados inválidos' };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      // Implement social login
      console.log(`Social login with ${provider}`);
    } catch (error) {
      setError(`Erro ao fazer login com ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'admin':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900',
          card: 'bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800',
          button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
          accent: 'text-blue-600'
        };
      case 'customer':
        return {
          container: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900',
          card: 'bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800',
          button: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
          accent: 'text-green-600'
        };
      default:
        return {
          container: 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800',
          card: 'bg-white dark:bg-gray-800',
          button: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
          accent: 'text-primary-600'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`min-h-screen ${styles.container} flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full ${styles.card} rounded-2xl shadow-2xl p-8`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <SafeIcon 
              icon={variant === 'admin' ? FiShield : FiUser} 
              className={`w-8 h-8 ${styles.accent}`} 
            />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isRegisterMode ? 'Criar conta' : title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRegisterMode ? 'Preencha os dados para criar sua conta' : subtitle}
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Login Options */}
        {variant !== 'admin' && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
              </button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">ou</span>
              </div>
            </div>
          </div>
        )}

        {/* Login/Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field for registration */}
          {isRegisterMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome completo
              </label>
              <div className="relative">
                <SafeIcon icon={FiUser} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required={isRegisterMode}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </motion.div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail
            </label>
            <div className="relative">
              <SafeIcon icon={FiMail} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder={variant === 'admin' ? 'admin@exemplo.com' : 'seu@email.com'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <SafeIcon icon={FiLock} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Confirm Password for registration */}
          {isRegisterMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <SafeIcon icon={FiLock} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword || ''}
                  onChange={handleInputChange}
                  required={isRegisterMode}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Confirme sua senha"
                />
              </div>
            </motion.div>
          )}

          {/* Remember me / Terms */}
          <div className="flex items-center justify-between">
            {!isRegisterMode ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Lembrar de mim
                </label>
              </div>
            ) : (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms || false}
                  onChange={handleInputChange}
                  required={isRegisterMode}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Aceito os{' '}
                  <a href="#" className={`${styles.accent} hover:underline`}>
                    termos de uso
                  </a>
                </label>
              </div>
            )}

            {!isRegisterMode && (
              <a
                href="#"
                className={`text-sm ${styles.accent} hover:underline`}
              >
                Esqueceu a senha?
              </a>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : `${styles.button} shadow-lg hover:shadow-xl`}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                {isRegisterMode ? 'Criando conta...' : 'Entrando...'}
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>{isRegisterMode ? 'Criar conta' : 'Entrar'}</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </span>
            )}
          </motion.button>
        </form>

        {/* Toggle Register/Login */}
        {showRegister && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRegisterMode ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setError('');
                  setFormData({ email: '', password: '', rememberMe: false });
                }}
                className={`${styles.accent} hover:underline font-medium`}
              >
                {isRegisterMode ? 'Fazer login' : 'Criar conta'}
              </button>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Sistema de Checkout Digital v2.0</p>
          <p>Desenvolvido com ❤️ para maximizar conversões</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;