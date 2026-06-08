import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.API_PORT || 4000);

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jwp_buildstock_manager',
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(express.json());

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  ...(process.env.FRONTEND_URL || '').split(',').map((origin) => origin.trim()).filter(Boolean),
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.has(origin)) {
    res.header('Access-Control-Allow-Origin', origin || 'http://localhost:3000');
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

const nowSql = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

const normalizeText = (value) => String(value ?? '').trim();
const normalizeUpper = (value) => normalizeText(value).toUpperCase();

const sendDbError = (res, error) => {
  console.error(error);
  res.status(500).json({
    error: error.sqlMessage || error.message || 'Database error',
  });
};

const sendBadRequest = (res, message) => {
  res.status(400).json({ error: message });
};

const sendConflict = (res, message) => {
  res.status(409).json({ error: message });
};

async function getBootstrapData() {
  const [categories] = await pool.query('SELECT id, code, name, description, created_at FROM categories ORDER BY created_at ASC, id ASC');
  const [products] = await pool.query('SELECT id, code, name, category_id, stock, unit_type, min_stock, price, created_at FROM products ORDER BY created_at ASC, id ASC');
  const [transactions] = await pool.query(
    'SELECT id, invoice_number, type, product_id, quantity, reference_person, DATE_FORMAT(transaction_date, "%Y-%m-%d") AS transaction_date, notes, created_at FROM stock_transactions ORDER BY created_at DESC, id DESC'
  );
  const [users] = await pool.query('SELECT id, name, email, role, status, avatar FROM users ORDER BY created_at ASC, id ASC');

  return { categories, products, transactions, users };
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, name, email, password, role, status, avatar FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
    [email]
  );
  return rows[0];
}

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  avatar: user.avatar,
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    sendDbError(res, error);
  }
});

app.get('/api/bootstrap', async (req, res) => {
  try {
    res.json(await getBootstrapData());
  } catch (error) {
    sendDbError(res, error);
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = normalizeText(req.body.email).toLowerCase();
  const password = normalizeText(req.body.password);

  if (!email || !password) {
    sendBadRequest(res, 'Email dan password wajib diisi');
    return;
  }

  try {
    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Email atau password tidak sesuai' });
      return;
    }

    if (user.status !== 'Aktif') {
      res.status(403).json({ error: 'Akun sedang nonaktif' });
      return;
    }

    res.json(toPublicUser(user));
  } catch (error) {
    sendDbError(res, error);
  }
});

app.post('/api/categories', async (req, res) => {
  const id = `cat-${Date.now()}`;
  const createdAt = nowSql();
  const code = normalizeUpper(req.body.code);
  const name = normalizeText(req.body.name);
  const description = normalizeText(req.body.description);

  if (!code || !name) {
    sendBadRequest(res, 'Kode dan nama kategori wajib diisi');
    return;
  }

  if (code.length > 10) {
    sendBadRequest(res, 'Kode kategori maksimal 10 karakter');
    return;
  }

  try {
    const [duplicates] = await pool.query(
      'SELECT id FROM categories WHERE LOWER(code) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1',
      [code, name]
    );

    if (duplicates.length > 0) {
      sendConflict(res, 'Kode atau nama kategori sudah digunakan');
      return;
    }

    await pool.query(
      'INSERT INTO categories (id, code, name, description, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, code, name, description, createdAt]
    );
    const [rows] = await pool.query('SELECT id, code, name, description, created_at FROM categories WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.put('/api/categories/:id', async (req, res) => {
  const code = normalizeUpper(req.body.code);
  const name = normalizeText(req.body.name);
  const description = normalizeText(req.body.description);

  if (!code || !name) {
    sendBadRequest(res, 'Kode dan nama kategori wajib diisi');
    return;
  }

  try {
    const [duplicates] = await pool.query(
      'SELECT id FROM categories WHERE (LOWER(code) = LOWER(?) OR LOWER(name) = LOWER(?)) AND id <> ? LIMIT 1',
      [code, name, req.params.id]
    );

    if (duplicates.length > 0) {
      sendConflict(res, 'Kode atau nama kategori sudah digunakan');
      return;
    }

    await pool.query(
      'UPDATE categories SET code = ?, name = ?, description = ? WHERE id = ?',
      [code, name, description, req.params.id]
    );
    const [rows] = await pool.query('SELECT id, code, name, description, created_at FROM categories WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const [productRows] = await pool.query('SELECT COUNT(*) AS total FROM products WHERE category_id = ?', [req.params.id]);

    if (productRows[0].total > 0) {
      sendConflict(res, 'Kategori tidak dapat dihapus karena masih digunakan oleh produk');
      return;
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    sendDbError(res, error);
  }
});

app.post('/api/products', async (req, res) => {
  const id = `prod-${Date.now()}`;
  const createdAt = nowSql();
  const code = normalizeUpper(req.body.code);
  const name = normalizeText(req.body.name);
  const categoryId = normalizeText(req.body.category_id);
  const unitType = normalizeUpper(req.body.unit_type);
  const stock = Number(req.body.stock);
  const minStock = Number(req.body.min_stock);
  const price = Number(req.body.price);

  if (!code || !name || !categoryId || !unitType) {
    sendBadRequest(res, 'Kode, nama, kategori, dan satuan barang wajib diisi');
    return;
  }

  if (!Number.isFinite(stock) || stock < 0 || !Number.isFinite(minStock) || minStock <= 0 || !Number.isFinite(price) || price < 0) {
    sendBadRequest(res, 'Stok, stok minimum, dan harga harus bernilai valid');
    return;
  }

  try {
    const [duplicates] = await pool.query('SELECT id FROM products WHERE LOWER(code) = LOWER(?) LIMIT 1', [code]);
    if (duplicates.length > 0) {
      sendConflict(res, 'Kode produk sudah digunakan');
      return;
    }

    const [categories] = await pool.query('SELECT id FROM categories WHERE id = ? LIMIT 1', [categoryId]);
    if (categories.length === 0) {
      sendBadRequest(res, 'Kategori produk tidak ditemukan');
      return;
    }

    await pool.query(
      'INSERT INTO products (id, code, name, category_id, stock, unit_type, min_stock, price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, code, name, categoryId, stock, unitType, minStock, price, createdAt]
    );
    const [rows] = await pool.query('SELECT id, code, name, category_id, stock, unit_type, min_stock, price, created_at FROM products WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.put('/api/products/:id', async (req, res) => {
  const name = normalizeText(req.body.name);
  const categoryId = normalizeText(req.body.category_id);
  const stock = Number(req.body.stock);
  const unitType = normalizeUpper(req.body.unit_type);
  const minStock = Number(req.body.min_stock);
  const price = Number(req.body.price);

  if (!name || !categoryId || !unitType) {
    sendBadRequest(res, 'Nama, kategori, dan satuan barang wajib diisi');
    return;
  }

  if (!Number.isFinite(stock) || stock < 0 || !Number.isFinite(minStock) || minStock <= 0 || !Number.isFinite(price) || price < 0) {
    sendBadRequest(res, 'Stok, stok minimum, dan harga harus bernilai valid');
    return;
  }

  try {
    const [categories] = await pool.query('SELECT id FROM categories WHERE id = ? LIMIT 1', [categoryId]);
    if (categories.length === 0) {
      sendBadRequest(res, 'Kategori produk tidak ditemukan');
      return;
    }

    await pool.query(
      'UPDATE products SET name = ?, category_id = ?, stock = ?, unit_type = ?, min_stock = ?, price = ? WHERE id = ?',
      [name, categoryId, stock, unitType, minStock, price, req.params.id]
    );
    const [rows] = await pool.query('SELECT id, code, name, category_id, stock, unit_type, min_stock, price, created_at FROM products WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const [transactionRows] = await pool.query('SELECT COUNT(*) AS total FROM stock_transactions WHERE product_id = ?', [req.params.id]);

    if (transactionRows[0].total > 0) {
      sendConflict(res, 'Produk tidak dapat dihapus karena sudah memiliki riwayat transaksi');
      return;
    }

    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    sendDbError(res, error);
  }
});

app.post('/api/transactions', async (req, res) => {
  const id = `trx-${Date.now()}`;
  const createdAt = nowSql();
  const invoiceNumber = normalizeUpper(req.body.invoice_number);
  const type = normalizeUpper(req.body.type);
  const productId = normalizeText(req.body.product_id);
  const quantity = Number(req.body.quantity);
  const referencePerson = normalizeText(req.body.reference_person);
  const transactionDate = normalizeText(req.body.transaction_date);
  const notes = normalizeText(req.body.notes);

  if (!invoiceNumber || !productId || !referencePerson || !transactionDate) {
    sendBadRequest(res, 'Nomor invoice, produk, tanggal, dan pemasok/penerima wajib diisi');
    return;
  }

  if (!['MASUK', 'KELUAR'].includes(type)) {
    sendBadRequest(res, 'Jenis transaksi harus MASUK atau KELUAR');
    return;
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    sendBadRequest(res, 'Jumlah transaksi harus lebih besar dari 0');
    return;
  }

  try {
    const [products] = await pool.query('SELECT id, stock FROM products WHERE id = ? LIMIT 1', [productId]);

    if (products.length === 0) {
      sendBadRequest(res, 'Produk transaksi tidak ditemukan');
      return;
    }

    if (type === 'KELUAR' && quantity > products[0].stock) {
      sendConflict(res, 'Stok tidak mencukupi untuk transaksi barang keluar');
      return;
    }

    await pool.query(
      'INSERT INTO stock_transactions (id, invoice_number, type, product_id, quantity, reference_person, transaction_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, invoiceNumber, type, productId, quantity, referencePerson, transactionDate, notes, createdAt]
    );
    res.status(201).json(await getBootstrapData());
  } catch (error) {
    sendDbError(res, error);
  }
});

app.post('/api/users', async (req, res) => {
  const id = `user-${Date.now()}`;
  const name = normalizeText(req.body.name);
  const email = normalizeText(req.body.email).toLowerCase();
  const role = normalizeText(req.body.role) || 'Admin';
  const status = normalizeText(req.body.status) || 'Aktif';
  const avatar = normalizeText(req.body.avatar);
  const password = normalizeText(req.body.password) || 'password123';

  if (!name || !email || !password) {
    sendBadRequest(res, 'Nama, email, dan password pengguna wajib diisi');
    return;
  }

  if (!email.includes('@')) {
    sendBadRequest(res, 'Format email tidak valid');
    return;
  }

  if (!['Admin', 'Super Admin'].includes(role) || !['Aktif', 'Nonaktif'].includes(status)) {
    sendBadRequest(res, 'Role atau status pengguna tidak valid');
    return;
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      sendConflict(res, 'Email pengguna sudah terdaftar');
      return;
    }

    await pool.query(
      'INSERT INTO users (id, name, email, password, role, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, password, role, status, avatar || null]
    );
    const [rows] = await pool.query('SELECT id, name, email, role, status, avatar FROM users WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.put('/api/users/:id', async (req, res) => {
  const name = normalizeText(req.body.name);
  const email = normalizeText(req.body.email).toLowerCase();
  const role = normalizeText(req.body.role) || 'Admin';
  const status = normalizeText(req.body.status) || 'Aktif';
  const avatar = normalizeText(req.body.avatar);
  const password = normalizeText(req.body.password);

  if (!name || !email) {
    sendBadRequest(res, 'Nama dan email pengguna wajib diisi');
    return;
  }

  if (!email.includes('@')) {
    sendBadRequest(res, 'Format email tidak valid');
    return;
  }

  try {
    const [duplicates] = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id <> ? LIMIT 1',
      [email, req.params.id]
    );

    if (duplicates.length > 0) {
      sendConflict(res, 'Email pengguna sudah digunakan akun lain');
      return;
    }

    if (password) {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, role = ?, status = ?, avatar = ?, password = ? WHERE id = ?',
        [name, email, role, status, avatar || null, password, req.params.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, role = ?, status = ?, avatar = ? WHERE id = ?',
        [name, email, role, status, avatar || null, req.params.id]
      );
    }

    const [rows] = await pool.query('SELECT id, name, email, role, status, avatar FROM users WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT email, status FROM users WHERE id = ? LIMIT 1', [req.params.id]);

    if (rows[0]?.email === 'admin@toko-jwp.com') {
      sendConflict(res, 'Akun Super Admin bawaan tidak dapat dihapus');
      return;
    }

    if (rows[0]?.status === 'Aktif') {
      sendConflict(res, 'Akun aktif yang masih bisa login ke dashboard tidak dapat dihapus');
      return;
    }

    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    sendDbError(res, error);
  }
});

app.listen(port, () => {
  console.log(`JWP API running at http://localhost:${port}`);
});
