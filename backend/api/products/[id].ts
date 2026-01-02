import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../../src/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'DELETE') {
        // Admin only - add auth middleware check here
        try {
            await pool.query('DELETE FROM products WHERE id = $1', [id]);
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
