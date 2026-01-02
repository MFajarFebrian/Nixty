import { Router, Request, Response } from 'express';
import pool from './database';
import { authenticateToken } from './auth';
import { decrypt } from './utils'; // Assuming decrypt is implemented in utils

const router = Router();

// Middleware to check role (Duplicated from products.ts for now, ideally move to auth.ts)
const authorizeRole = (role: string) => {
    return (req: Request, res: Response, next: any) => {
        const userFn = (req as any).user;
        if (!userFn || userFn.role !== role) {
            return res.status(403).send('Access denied');
        }
        next();
    };
};

// Admin: Get All Orders
router.get('/admin', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error fetching all orders');
    }
});

// Admin: Get Stats
router.get('/stats', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
    try {
        const orderCountRes = await pool.query("SELECT COUNT(*) FROM orders");
        const revenueRes = await pool.query("SELECT SUM(total_amount) FROM orders WHERE status = 'paid'"); // Only count paid orders
        const productCountRes = await pool.query("SELECT COUNT(*) FROM products");
        const userCountRes = await pool.query("SELECT COUNT(*) FROM users");

        res.json({
            totalOrders: parseInt(orderCountRes.rows[0].count),
            totalRevenue: parseFloat(revenueRes.rows[0].sum || '0'),
            totalProducts: parseInt(productCountRes.rows[0].count),
            totalUsers: parseInt(userCountRes.rows[0].count)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching stats');
    }
});

// List User Orders
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user_id = (req as any).user.id;
    try {
        const result = await pool.query(
            "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
            [user_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error fetching orders');
    }
});

// Create Order
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const user_id = (req as any).user.id;
    const { items } = req.body; // Expect [{ product_id, quantity }] - simplified to 1 item for now or loop
    // Simplified: 1 product per order for this demo or calculate total
    const { product_id, price } = items[0];

    try {
        const result = await pool.query(
            "INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, 'pending') RETURNING *",
            [user_id, price]
        );
        // Add Order Items logic here (omitted for brevity, linking directly to order in payments)

        // Insert order item placeholder
        await pool.query(
            "INSERT INTO order_items (order_id, product_id, price_at_purchase) VALUES ($1, $2, $3)",
            [result.rows[0].id, product_id, price]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
});

// Simulate Payment Webhook (The Core Fulfillment Logic)
router.post('/:id/pay', async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Check Order
        const orderRes = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [orderId]);
        if (orderRes.rows.length === 0) throw new Error('Order not found');
        const order = orderRes.rows[0];

        if (order.status === 'paid') {
            await client.query('ROLLBACK');
            return res.status(200).json({ message: 'Already paid' });
        }

        // 2. Get Product related to order (Simplified: assuming single item)
        const itemRes = await client.query("SELECT * FROM order_items WHERE order_id = $1", [orderId]);
        const product_id = itemRes.rows[0].product_id;

        // 3. Find and Lock Inventory
        const invRes = await client.query(
            "SELECT id, data FROM inventory WHERE product_id = $1 AND status = 'available' LIMIT 1 FOR UPDATE SKIP LOCKED",
            [product_id]
        );

        if (invRes.rows.length === 0) {
            throw new Error('Out of stock');
        }

        const inventoryItem = invRes.rows[0];

        // 4. Update Inventory
        await client.query(
            "UPDATE inventory SET status = 'sold', order_id = $1 WHERE id = $2",
            [orderId, inventoryItem.id]
        );

        // 5. Update Order
        await client.query("UPDATE orders SET status = 'paid', payment_reference = 'simulated' WHERE id = $1", [orderId]);

        await client.query('COMMIT');

        // 6. Decrypt and Return (or Email)
        const decryptedData = decrypt(inventoryItem.data);

        res.json({ status: 'paid', license: decryptedData });

    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(400).send(error.message || 'Payment processing failed');
    } finally {
        client.release();
    }
});

export default router;
