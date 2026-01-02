import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import pool from '../../src/database';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        // Get user's orders
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const result = await pool.query(
                'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
                [decoded.id]
            );
            res.json(result.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'POST') {
        // Create order
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const { items } = req.body;

            const totalAmount = items.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0);

            const result = await pool.query(
                'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
                [decoded.id, totalAmount, 'pending']
            );

            const order = result.rows[0];

            for (const item of items) {
                await pool.query(
                    'INSERT INTO order_items (order_id, product_id, price) VALUES ($1, $2, $3)',
                    [order.id, item.product_id, item.price]
                );
            }

            res.status(201).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
