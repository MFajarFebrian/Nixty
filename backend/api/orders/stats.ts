import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import pool from '../../src/database';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admin only' });
        }

        const revenueResult = await pool.query(
            "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status = 'paid'"
        );
        const ordersResult = await pool.query('SELECT COUNT(*) as count FROM orders');
        const productsResult = await pool.query('SELECT COUNT(*) as count FROM products');
        const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');

        res.json({
            totalRevenue: parseFloat(revenueResult.rows[0].total),
            totalOrders: parseInt(ordersResult.rows[0].count),
            totalProducts: parseInt(productsResult.rows[0].count),
            totalUsers: parseInt(usersResult.rows[0].count)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
