'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:3001/orders/admin', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-8">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border p-6 hidden md:block">
                <h1 className="text-2xl font-bold mb-8 text-primary">Nixty Admin</h1>
                <nav className="space-y-4">
                    <Link href="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors text-muted-foreground">Dashboard</Link>
                    <Link href="/admin/products" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors text-muted-foreground">Products</Link>
                    <Link href="/admin/orders" className="block py-2 px-4 rounded bg-primary/10 text-primary font-medium">Orders</Link>
                    <Link href="/" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors mt-8 text-muted-foreground border border-border">View Store</Link>
                </nav>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold text-foreground mb-6">Order History</h2>

                <div className="bg-card rounded-xl shadow overflow-hidden border border-border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">{order.user_id.split('-')[0]}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-foreground">${order.total_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
