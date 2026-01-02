'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // In this demo, we check if we have a token from a purchase or login
        // If not, we might redirect to login, but for now we'll just show empty or mock
        // Since we don't have a global auth provider fully hooked up to a user/pass login page that stores in localStorage (except Admin),
        // we will try to read 'token' from localStorage if it exists (from Admin login or BuyButton purchase flow).

        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:3001/orders', {
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

    return (
        <main className="min-h-screen pt-24 px-4 pb-12 bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-border/50 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">My Dashboard</h1>
                        <p className="text-muted-foreground">Manage your purchases and licenses.</p>
                    </div>
                </div>

                {!loading && orders.length === 0 ? (
                    <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-border">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl">🚀</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No missions yet</h3>
                        <p className="text-muted-foreground mb-6">You haven't purchased any software licenses.</p>
                        <Link href="/catalog" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-opacity-90 transition-all">
                            Browse Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-card rounded-xl p-6 border border-border shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase border border-green-500/20"> Paid</span>
                                        <span className="text-sm text-muted-foreground font-mono">#{order.id.slice(0, 8)}</span>
                                    </div>
                                    <div className="text-lg font-semibold text-foreground">
                                        Software License Purchase
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-sm text-muted-foreground">Total</div>
                                        <div className="text-2xl font-bold text-foreground">${order.total_amount}</div>
                                    </div>
                                    <button className="px-4 py-2 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors font-medium text-sm">
                                        View License
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
