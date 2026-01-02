'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!token) {
            router.push('/admin/login');
            return;
        }

        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:3001/products');
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [token, router]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`http://localhost:3001/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            alert('Error deleting product');
        }
    };

    if (loading) return <div className="p-8">Loading products...</div>;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar (Duplicated for simplicity, ideally componentized) */}
            <aside className="w-64 bg-card border-r border-border p-6 hidden md:block">
                <h1 className="text-2xl font-bold mb-8 text-primary">Nixty Admin</h1>
                <nav className="space-y-4">
                    <Link href="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors text-muted-foreground">Dashboard</Link>
                    <Link href="/admin/products" className="block py-2 px-4 rounded bg-primary/10 text-primary font-medium">Products</Link>
                    <Link href="/admin/orders" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors text-muted-foreground">Orders</Link>
                    <Link href="/" className="block py-2 px-4 rounded hover:bg-accent/10 hover:text-accent transition-colors mt-8 text-muted-foreground border border-border">View Store</Link>
                </nav>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-foreground">Products</h2>
                    <Link href="/admin/products/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                        + Add Product
                    </Link>
                </div>

                <div className="bg-card rounded-xl shadow overflow-hidden border border-border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground capitalize">{product.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive/80 ml-4">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
