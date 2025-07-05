import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de autenticação
    const token = localStorage.getItem('adminToken');
    if (token === 'mock-jwt-token') {
      setUser({
        id: 1,
        email: 'admin@admin.com',
        name: 'Admin',
        role: 'super_admin',
        permissions: [
          'dashboard.view',
          'products.view',
          'products.create',
          'products.edit',
          'products.delete',
          'orders.view',
          'orders.edit',
          'orders.export',
          'metrics.view',
          'settings.view',
          'settings.edit',
          'users.view',
          'users.create',
          'users.edit',
          'users.delete'
        ]
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock authentication
      if (email === 'admin@admin.com' && password === 'admin123') {
        const userData = {
          id: 1,
          email: 'admin@admin.com',
          name: 'Admin',
          role: 'super_admin',
          permissions: [
            'dashboard.view',
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            'orders.view',
            'orders.edit',
            'orders.export',
            'metrics.view',
            'settings.view',
            'settings.edit',
            'users.view',
            'users.create',
            'users.edit',
            'users.delete'
          ]
        };
        
        localStorage.setItem('adminToken', 'mock-jwt-token');
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciais inválidas' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.role === 'super_admin';
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || user.role === 'super_admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      hasPermission,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};