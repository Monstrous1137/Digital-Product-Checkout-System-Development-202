import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CheckoutProvider } from './contexts/CheckoutContext';

// Pages
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentPending from './pages/PaymentPending';
import PaymentFailed from './pages/PaymentFailed';
import ProductAccess from './pages/ProductAccess';
import Upsell from './pages/Upsell';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminMetrics from './pages/admin/AdminMetrics';
import AdminUsers from './pages/admin/AdminUsers';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/layouts/AdminLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CheckoutProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Checkout />} />
              <Route path="/checkout/:productId" element={<Checkout />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/pending" element={<PaymentPending />} />
              <Route path="/payment/failed" element={<PaymentFailed />} />
              <Route path="/product/access/:orderNumber" element={<ProductAccess />} />
              <Route path="/upsell/:orderNumber" element={<Upsell />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredPermission="dashboard.view">
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute requiredPermission="products.view">
                    <AdminLayout>
                      <AdminProducts />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute requiredPermission="orders.view">
                    <AdminLayout>
                      <AdminOrders />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/metrics" 
                element={
                  <ProtectedRoute requiredPermission="metrics.view">
                    <AdminLayout>
                      <AdminMetrics />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredPermission="users.view">
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requiredPermission="settings.view">
                    <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </CheckoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;