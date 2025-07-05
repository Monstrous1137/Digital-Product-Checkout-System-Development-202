import supabase from '../lib/supabase';

// Tabelas do banco de dados
export const createTables = async () => {
  try {
    // Tabela de produtos
    const { error: productsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products_checkout (
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

        ALTER TABLE products_checkout ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Enable read access for all users" ON products_checkout FOR SELECT USING (true);
        CREATE POLICY "Enable all operations for authenticated users" ON products_checkout FOR ALL USING (auth.role() = 'authenticated');
      `
    });

    if (productsError) throw productsError;

    // Tabela de pedidos
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders_checkout (
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

        ALTER TABLE orders_checkout ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Enable read access for all users" ON orders_checkout FOR SELECT USING (true);
        CREATE POLICY "Enable all operations for authenticated users" ON orders_checkout FOR ALL USING (auth.role() = 'authenticated');
      `
    });

    if (ordersError) throw ordersError;

    // Tabela de configurações
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS checkout_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          key TEXT UNIQUE NOT NULL,
          value JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        ALTER TABLE checkout_settings ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Enable all operations for authenticated users" ON checkout_settings FOR ALL USING (auth.role() = 'authenticated');
      `
    });

    if (settingsError) throw settingsError;

    console.log('✅ Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  }
};

// Funções para produtos
export const getProduct = async (id) => {
  const { data, error } = await supabase
    .from('products_checkout')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error) throw error;
  return data;
};

export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders_checkout')
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId, status, paymentData = {}) => {
  const { data, error } = await supabase
    .from('orders_checkout')
    .update({
      payment_status: status,
      ...paymentData,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrder = async (orderNumber) => {
  const { data, error } = await supabase
    .from('orders_checkout')
    .select(`
      *,
      products_checkout (*)
    `)
    .eq('order_number', orderNumber)
    .single();

  if (error) throw error;
  return data;
};

// Configurações
export const getSetting = async (key) => {
  const { data, error } = await supabase
    .from('checkout_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.value || null;
};

export const setSetting = async (key, value) => {
  const { data, error } = await supabase
    .from('checkout_settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
  return data;
};