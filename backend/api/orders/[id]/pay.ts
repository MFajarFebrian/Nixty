import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import pool from '../../../src/database';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        const orderResult = await pool.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [id, decoded.id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        if (order.status === 'paid') {
            return res.status(400).json({ error: 'Order already paid' });
        }

        const itemsResult = await pool.query(
            'SELECT oi.*, p.name, p.type FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
            [id]
        );

        const items = itemsResult.rows;
        let licenseData = '';

        for (const item of items) {
            const inventoryResult = await pool.query(
                'SELECT * FROM inventory WHERE product_id = $1 AND status = $2 LIMIT 1',
                [item.product_id, 'available']
            );

            if (inventoryResult.rows.length === 0) {
                return res.status(400).json({ error: `Product ${item.name} out of stock` });
            }

            const inventoryItem = inventoryResult.rows[0];

            await pool.query(
                'UPDATE inventory SET status = $1, order_id = $2 WHERE id = $3',
                ['sold', id, inventoryItem.id]
            );

            licenseData += `${item.name}: ${inventoryItem.license_key}\n`;
        }

        const encryptedLicense = encrypt(licenseData);

        await pool.query(
            'UPDATE orders SET status = $1, encrypted_license = $2 WHERE id = $3',
            ['paid', encryptedLicense, id]
        );

        res.json({ license: licenseData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
