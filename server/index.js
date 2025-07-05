const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Mock data for development
const mockProduct = {
  id: '1',
  name: 'Curso Completo de Marketing Digital',
  price: 97.00,
  image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop',
  deliveryLink: 'https://drive.google.com/file/d/example',
  installments: 12,
  active: true
};

const mockStats = {
  totalSales: 15420.50,
  totalOrders: 234,
  totalCustomers: 189,
  conversionRate: 3.2,
  todaySales: 1250.00,
  weekSales: 8750.30,
  monthSales: 15420.50
};

const mockOrders = [
  {
    id: 'ORD001',
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    customerPhone: '(11) 99999-9999',
    productName: 'Curso Completo de Marketing Digital',
    amount: 97.00,
    status: 'approved',
    paymentMethod: 'credit_card',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORD002',
    customerName: 'Maria Santos',
    customerEmail: 'maria@email.com',
    customerPhone: '(11) 88888-8888',
    productName: 'Curso Completo de Marketing Digital',
    amount: 97.00,
    status: 'pending',
    paymentMethod: 'pix',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// API Routes
app.get('/api/products/:id', (req, res) => {
  res.json(mockProduct);
});

app.post('/api/payments/process', (req, res) => {
  const { paymentMethod } = req.body;
  
  // Simulate payment processing
  setTimeout(() => {
    let status = 'approved';
    if (paymentMethod === 'pix') {
      status = Math.random() > 0.7 ? 'pending' : 'approved';
    } else if (paymentMethod === 'credit_card') {
      status = Math.random() > 0.9 ? 'failed' : 'approved';
    }
    
    const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    res.json({
      status,
      orderId,
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });
  }, 2000);
});

app.get('/api/orders/:orderId', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.orderId) || {
    id: req.params.orderId,
    customerName: 'Cliente Exemplo',
    productName: 'Curso Completo de Marketing Digital',
    status: 'approved',
    createdAt: new Date().toISOString()
  };
  
  res.json(order);
});

// Admin routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email === 'admin@admin.com' && password === 'admin123') {
    res.json({
      token: 'mock-jwt-token',
      user: { id: 1, email: 'admin@admin.com', name: 'Admin' }
    });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token === 'mock-jwt-token') {
    res.json({ id: 1, email: 'admin@admin.com', name: 'Admin' });
  } else {
    res.status(401).json({ message: 'Token inválido' });
  }
});

app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    stats: mockStats,
    recentOrders: mockOrders.slice(0, 5)
  });
});

app.get('/api/admin/products', (req, res) => {
  res.json([mockProduct]);
});

app.post('/api/admin/products', (req, res) => {
  const newProduct = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body
  };
  res.json(newProduct);
});

app.get('/api/admin/orders', (req, res) => {
  res.json(mockOrders);
});

app.get('/api/admin/metrics', (req, res) => {
  res.json({
    revenue: {
      today: 1250.00,
      yesterday: 980.50,
      week: 8750.30,
      lastWeek: 7200.80,
      month: 15420.50,
      lastMonth: 12300.20
    },
    orders: {
      today: 15,
      yesterday: 12,
      week: 89,
      lastWeek: 76,
      month: 234,
      lastMonth: 198
    },
    customers: {
      today: 12,
      yesterday: 10,
      week: 67,
      lastWeek: 58,
      month: 189,
      lastMonth: 156
    },
    conversion: {
      today: 3.2,
      yesterday: 2.8,
      week: 3.5,
      lastWeek: 3.1,
      month: 3.2,
      lastMonth: 2.9
    },
    topProducts: [
      { id: 1, name: 'Curso de Marketing Digital', sales: 150, revenue: 14550.00 },
      { id: 2, name: 'E-book Premium', sales: 84, revenue: 2520.00 }
    ],
    recentActivity: [
      { description: 'Nova venda realizada - João Silva', time: '2 min atrás' },
      { description: 'Produto criado - Curso Avançado', time: '1 hora atrás' }
    ]
  });
});

app.get('/api/admin/settings', (req, res) => {
  res.json({
    companyName: 'Minha Empresa Digital',
    primaryColor: '#f43f5e',
    secondaryColor: '#64748b'
  });
});

app.put('/api/admin/settings', (req, res) => {
  res.json({ message: 'Configurações salvas com sucesso' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  console.log(`🔐 Admin: admin@admin.com / admin123`);
});