'use client';

import { useState } from 'react';
import { login, createOrder, payOrder } from '@/lib/api';

export default function BuyButton({ productId, price }: { productId: string, price: number }) {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [license, setLicense] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const handleBuy = async () => {
        setStatus('loading');
        try {
            // 1. Login (Simplified: User provides creds to buy)
            // Ideally register if not exists, but for demo we assume login works or we hardcode a demo user
            // For this demo, we'll try to login. If 'User not found' we might fail. 
            // PRO TIP: You need to register a user via Postman or script first, OR we implement auto-register here.
            // Let's assume the user has an account or we alert them.

            const loginRes = await login(email, password);
            setToken(loginRes.token);

            // 2. Create Order
            const order = await createOrder(loginRes.token, [{ product_id: productId, price }]);

            // 3. Pay
            const payRes = await payOrder(order.id);

            setLicense(payRes.license);
            setStatus('success');
        } catch (e: any) {
            console.error(e);
            alert(e.message);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <h3 className="text-green-800 font-bold mb-2">Purchase Successful!</h3>
                <p className="text-sm text-green-700 mb-2">Here is your license/credential:</p>
                <code className="block bg-white p-2 rounded border border-green-200 select-all font-mono text-green-900">
                    {license}
                </code>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 mt-6 p-6 bg-card rounded-lg border border-border shadow-sm">
            <h3 className="font-semibold text-card-foreground">Purchase Product</h3>
            <div className="space-y-3">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border border-input bg-input rounded text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border border-input bg-input rounded text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    onClick={handleBuy}
                    disabled={status === 'loading' || !email || !password}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
                >
                    {status === 'loading' ? 'Processing...' : `Buy Now for $${price}`}
                </button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Secure payment processing handled by Nixty Backend.
            </p>
        </div>
    );
}
