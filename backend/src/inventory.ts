import { Router, Request, Response } from 'express';
import pool from './database';
import { authenticateToken } from './auth';
import { encrypt } from './utils';

const router = Router();

// Middleware to check role
// (Duplicated for simplicity or imported if shared)
const authorizeRole = (role: string) => {
    return (req: Request, res: Response, next: any) => {
        const userFn = (req as any).user;
        if (!userFn || userFn.role !== role) {
            return res.status(403).send('Access denied');
        }
        next();
    };
};

// Add Inventory (Admin)
router.post('/', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
    const { product_id, data } = req.body;
    try {
        const encryptedData = encrypt(data);
        const result = await pool.query(
            'INSERT INTO inventory (product_id, data, status) VALUES ($1, $2, $3) RETURNING id',
            [product_id, encryptedData, 'available']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding inventory');
    }
});

// Get Inventory Status (Admin)
router.get('/:product_id/count', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            "SELECT COUNT(*) FROM inventory WHERE product_id = $1 AND status = 'available'",
            [req.params.product_id]
        );
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        res.status(500).send('Error fetching count');
    }
});

export default router;
