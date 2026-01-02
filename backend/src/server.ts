import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import pool from './database';
import authRouter from './auth';
import productsRouter from './products';
import inventoryRouter from './inventory';
import ordersRouter from './orders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(json());

app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/inventory', inventoryRouter);
app.use('/orders', ordersRouter);

app.get('/health', async (req, res) => {
    try {
        const client = await pool.connect();
        client.release();
        res.status(200).json({ status: 'ok', db: 'connected' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', db: 'disconnected' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
