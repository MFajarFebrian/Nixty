const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        // Server-side
        return process.env.INTERNAL_API_URL || 'http://backend:3001';
    }
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

const API_URL = getBaseUrl();

export const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const fetchProduct = async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
};

export const createOrder = async (token: string, items: any[]) => {
    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
};

export const payOrder = async (orderId: string) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/pay`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Payment failed');
    return res.json();
};

export const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
};
