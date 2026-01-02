import pool from './database';
import bcrypt from 'bcrypt';
import { encrypt } from './utils';

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('Starting seed...');
    await client.query('BEGIN');

    // 1. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Admin
    const adminRes = await client.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ('admin@nixty.com', $1, 'admin') 
       ON CONFLICT (email) DO UPDATE SET role = 'admin' RETURNING id`,
      [passwordHash]
    );
    const adminId = adminRes.rows[0].id;
    console.log('Created Admin User: admin@nixty.com / password123');

    // Customer
    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ('user@example.com', $1, 'customer') 
       ON CONFLICT (email) DO NOTHING RETURNING id`,
      [passwordHash]
    );
    // If user exists, fetch id
    let userId = userRes.rows[0]?.id;
    if (!userId) {
        const u = await client.query("SELECT id FROM users WHERE email = 'user@example.com'");
        userId = u.rows[0].id;
    }
    console.log('Created Customer User: user@example.com / password123');

    // 2. Create Products
    const products = [
      { name: 'Windows 11 Pro', description: 'Professional OS license key.', price: 199.99, type: 'key' },
      { name: 'Office 365 Personal', description: '1-year subscription account.', price: 69.99, type: 'credential' },
      { name: 'Kaspersky Total Security', description: 'Antivirus protection key.', price: 49.99, type: 'key' },
      { name: 'Adobe Creative Cloud', description: '3-month prepaid account.', price: 89.99, type: 'credential' },
      { name: 'NordVPN 1 Year', description: 'VPN service license code.', price: 59.99, type: 'key' }
    ];

    for (const p of products) {
      const prodRes = await client.query(
        `INSERT INTO products (name, description, price, type) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [p.name, p.description, p.price, p.type]
      );
      const prodId = prodRes.rows[0].id;

      // 3. Add Inventory for each product (5 items each)
      for (let i = 1; i <= 5; i++) {
        let data = '';
        if (p.type === 'key') {
          data = `XXXX-${p.name.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}-ITEM${i}`;
        } else {
            data = JSON.stringify({ email: `buyer${i}@test.com`, password: `secure${Math.random().toString(36).substring(7)}` });
        }
        
        const encryptedData = encrypt(data);
        await client.query(
          `INSERT INTO inventory (product_id, data, status) VALUES ($1, $2, 'available')`,
          [prodId, encryptedData]
        );
      }
    }
    console.log('Created 5 Products with 5 inventory items each.');

    await client.query('COMMIT');
    console.log('Seed completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
  } finally {
    client.release();
    process.exit();
  }
};

seed();
