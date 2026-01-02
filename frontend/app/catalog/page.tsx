import Link from 'next/link';
import { fetchProducts } from '@/lib/api';

export default async function CatalogPage() {
    let products = [];
    try {
        products = await fetchProducts();
    } catch (e) {
        console.error(e);
    }

    return (
        <main className="min-h-screen pt-24 px-8 pb-12 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            Product Catalog
                        </h1>
                        <p className="text-muted-foreground text-lg">Find the perfect software for your mission.</p>
                    </div>
                    {/* Filter Placeholder */}
                    <div className="mt-4 md:mt-0 flex gap-2">
                        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent/10 transition">All</button>
                        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent/10 transition">Keys</button>
                        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent/10 transition">Accounts</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product: any) => (
                        <div key={product.id} className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col">
                            {/* Product Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="p-6 flex-1 relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{product.name}</h2>
                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-accent/10 text-accent uppercase tracking-wider border border-accent/20">
                                        {product.type}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{product.description}</p>
                            </div>

                            <div className="p-6 pt-0 mt-auto relative z-10 flex items-center justify-between border-t border-border/50">
                                <div className="text-2xl font-bold text-foreground">
                                    ${product.price}
                                </div>
                                <Link href={`/products/${product.id}`} className="px-6 py-2.5 rounded-xl bg-foreground text-background font-semibold hover:bg-primary hover:text-white transition-all">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">Star chart empty. No products found.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
