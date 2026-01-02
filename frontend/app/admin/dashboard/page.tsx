'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Note: We need to use "NEXT_PUBLIC_API_URL" equivalent directly here or update api.ts to include generic fetch
            // But api.ts logic is strictly for server/client diff. 
            // We'll trust our browser environment variable logic in api.ts or use direct fetch.
            // Let's rely on relative URL if proxying, but we don't have proxy. 
            // Use Client-side fetch logic.

            const res = await fetch(`http://localhost:3001/orders/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8">Loading stats...</div>;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border p-6 hidden md:block">
                <h1 className="text-2xl font-bold mb-8 text-primary">Nixty Admin</h1>
                <nav className="space-y-4">
                    <Link href="/admin/dashboard" className="block py-2 px-4 rounded bg-primary/10 text-primary font-medium">Dashboard</Link>
                    <Link href="/admin/products" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors text-muted-foreground">Products</Link>
                    <Link href="/admin/orders" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors text-muted-foreground">Orders</Link>
                    <Link href="/" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors mt-8 text-muted-foreground border border-border">View Store</Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold text-foreground mb-8">Dashboard Overview</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p className="text-3xl font-bold text-green-500">${stats?.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                        <p className="text-3xl font-bold text-blue-500">{stats?.totalOrders}</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <p className="text-sm font-medium text-muted-foreground">Products in Catalog</p>
                        <p className="text-3xl font-bold text-purple-500">{stats?.totalProducts}</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <p className="text-sm font-medium text-muted-foreground">Registered Users</p>
                        <p className="text-3xl font-bold text-orange-500">{stats?.totalUsers}</p>
                    </div>
                </div>

                {/* Graph Placeholder (Simulated visual) */}
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Sales Trend (Last 7 Days)</h3>
                    <div className="h-64 flex items-end space-x-2">
                        {/* Simple CSS Bar Chart */}
                        {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/80 rounded-t hover:bg-primary transition-colors" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
