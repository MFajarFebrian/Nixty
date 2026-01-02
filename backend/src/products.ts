import { Router, Request, Response, NextFunction } from 'express';
import pool from './database';
import { authenticateToken } from './auth';

const router = Router();

// Middleware to check role
const authorizeRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userFn = (req as any).user;
        if (!userFn || userFn.role !== role) {
            return res.status(403).send('Access denied');
        }
        next();
    };
};

// Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).send('Product not found');
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error fetching product');
    }
});

// Create product (Admin only)
router.post('/', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
    const { name, description, price, type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, description, price, type) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, type]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error creating product');
    }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
});

export default router;
