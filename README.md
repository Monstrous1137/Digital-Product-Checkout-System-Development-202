# Sistema de Checkout Digital - Inspirado na Hotmart 🚀

Um sistema completo e profissional de checkout para venda de produtos digitais, desenvolvido com React + Supabase, com design moderno inspirado na Hotmart e foco total em conversão.

## 🎯 CARACTERÍSTICAS PRINCIPAIS

### ✅ **Checkout de Alta Conversão**
- Layout inspirado na Hotmart com design moderno e limpo
- Faixa de escassez com contador regressivo animado
- Showcase do produto com imagens, avaliações e benefícios
- Preços em destaque com parcelamento
- Múltiplas formas de pagamento (Cartão, PIX QR Code, PayPal)
- Sistema de cupons de desconto com validação
- Order Bump integrado no checkout
- Campos com máscara automática (telefone, CPF/CNPJ)

### 🏗️ **Arquitetura Moderna**
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Supabase (Database + Auth + API)
- **Animações**: Framer Motion
- **Ícones**: React Icons (Feather)
- **QR Code**: React QR Code para PIX
- **Responsivo**: Mobile-first design

### 🔗 **Integrações Poderosas**
- **Supabase**: Banco de dados em tempo real
- **Stripe**: Pagamentos com cartão
- **Mercado Pago**: PIX + Cartão
- **PayPal**: Pagamentos internacionais
- **n8n**: Webhook para automações
- **Mautic**: E-mail marketing
- **Pixels**: Facebook, Google Analytics, TikTok

### 🛡️ **Sistema de Permissões**
- Autenticação completa com Supabase Auth
- Controle de acesso baseado em roles
- Permissões granulares por funcionalidade
- Proteção de rotas no frontend e backend

## 🚀 COMO USAR

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone [seu-repositorio]
cd checkout-hotmart

# Instale as dependências
npm install

# Configure o Supabase
# 1. Crie um projeto em https://supabase.com
# 2. Configure as credenciais em src/lib/supabase.js
# 3. Execute as migrações do banco
```

### 2. Configuração do Supabase

No painel do Supabase, execute as seguintes queries SQL:

```sql
-- Tabela de produtos
CREATE TABLE products_checkout (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  delivery_link TEXT,
  installments INTEGER DEFAULT 12,
  coupon_code TEXT,
  coupon_discount INTEGER DEFAULT 0,
  redirect_url TEXT,
  scarcity_enabled BOOLEAN DEFAULT false,
  scarcity_message TEXT DEFAULT 'Oferta termina em',
  scarcity_time_minutes INTEGER DEFAULT 10,
  orderbump_enabled BOOLEAN DEFAULT false,
  orderbump_product TEXT,
  orderbump_price DECIMAL(10,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE orders_checkout (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES products_checkout(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_document TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  transaction_id TEXT,
  coupon_used TEXT,
  orderbump_added BOOLEAN DEFAULT false,
  orderbump_amount DECIMAL(10,2) DEFAULT 0,
  webhook_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE products_checkout ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders_checkout ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Enable read access for all users" ON products_checkout FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON orders_checkout FOR SELECT USING (true);
```

### 3. Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# O sistema estará disponível em:
# Frontend: http://localhost:5173
# Checkout: http://localhost:5173/#/checkout/1
# Admin: http://localhost:5173/#/admin
```

### 4. Login Administrativo

- **URL**: `http://localhost:5173/#/admin`
- **E-mail**: `admin@admin.com`
- **Senha**: `admin123`

## 🎛️ FUNCIONALIDADES PRINCIPAIS

### 📱 **Checkout Responsivo**
- Design mobile-first
- Faixa de escassez animada
- Showcase do produto com play button
- Formulário em etapas com validação
- Múltiplos métodos de pagamento
- PIX com QR Code dinâmico
- Order bump contextual
- Resumo do pedido em tempo real

### 👨‍💼 **Painel Administrativo**
- **Dashboard**: Métricas de vendas e conversão
- **Produtos**: CRUD completo com configurações avançadas
- **Pedidos**: Visualização, filtros e exportação CSV
- **Usuários**: Sistema de roles e permissões
- **Métricas**: Análises detalhadas por período
- **Configurações**: Integrações e personalização

### 🎨 **Personalização Total**
- Cores e temas customizáveis
- Dark mode incluído
- Logos e imagens personalizáveis
- Mensagens de escassez configuráveis
- Layout responsivo e moderno

### 🔄 **Funil de Vendas Completo**

1. **Página de Checkout**
   - Escassez e urgência
   - Order bump integrado
   - Múltiplas formas de pagamento

2. **Processamento**
   - Validação em tempo real
   - Integração com gateways
   - Webhook para automações

3. **Redirecionamento Inteligente**
   - **Aprovado**: Página de sucesso + upsell
   - **Pendente**: Acompanhamento PIX
   - **Recusado**: Nova tentativa

4. **Entrega Digital**
   - Acesso imediato ao produto
   - Links de download/acesso
   - Instruções personalizadas

## 🛠️ CONFIGURAÇÕES AVANÇADAS

### **Integrações de Pagamento**
- Stripe: Cartões internacionais
- Mercado Pago: PIX + Cartões Brasil
- PayPal: Pagamentos globais

### **Automações**
- n8n: Webhook para fluxos personalizados
- Mautic: E-mail marketing automático
- Pixels: Tracking de conversões

### **Métricas e Analytics**
- Google Analytics: Acompanhamento completo
- Facebook Pixel: Otimização de campanhas
- TikTok Pixel: Campanhas no TikTok

## 📊 MÉTRICAS INCLUÍDAS

- **Vendas**: Total, por período, comparativos
- **Conversão**: Taxa por produto e método de pagamento
- **Clientes**: Novos vs recorrentes
- **Produtos**: Performance e rankings
- **Funil**: Acompanhamento por etapa

## 🔐 SEGURANÇA

- Autenticação JWT via Supabase
- Criptografia SSL/TLS
- Validação de dados no frontend e backend
- Sanitização de inputs
- Proteção CORS configurada
- RLS (Row Level Security) no Supabase

## 📱 RESPONSIVIDADE

- Mobile-first design
- Breakpoints otimizados
- Touch-friendly interfaces
- Carregamento progressivo
- Imagens otimizadas

## 🚀 DEPLOY

### **Vercel (Recomendado)**
```bash
npm run build
# Deploy automático via GitHub
```

### **Netlify**
```bash
npm run build
# Faça upload da pasta dist/
```

### **Servidor Próprio**
```bash
npm run build
# Configure nginx/apache para servir os arquivos estáticos
```

## 📈 OTIMIZAÇÕES DE CONVERSÃO

- **Escassez**: Timer configurável por produto
- **Social Proof**: Avaliações e números
- **Order Bump**: Ofertas adicionais estratégicas
- **Upsell**: Página pós-compra otimizada
- **Loading States**: Feedback visual constante
- **Micro-interações**: Animações sutis
- **Mobile Optimization**: Performance no mobile

## 🎯 CASOS DE USO

- ✅ **Cursos Online**
- ✅ **E-books e PDFs**
- ✅ **Software e Aplicativos**
- ✅ **Templates e Recursos**
- ✅ **Consultoria Digital**
- ✅ **Assinaturas e Memberships**

## 📞 SUPORTE

Sistema desenvolvido para máxima conversão e facilidade de uso.

**Recursos Inclusos:**
- Documentação completa
- Exemplos de configuração
- Templates prontos
- Suporte técnico

---

**🚀 Pronto para maximizar suas vendas digitais com o melhor checkout do mercado!**

*Inspirado na Hotmart, mas com recursos ainda mais avançados e totalmente customizável.*