import Link from 'next/link';
import { fetchProduct } from '@/lib/api';
import BuyButton from '@/components/BuyButton';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    let product;
    try {
        const { id } = await params;
        product = await fetchProduct(id);
    } catch (e) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-background">
                <div className="text-destructive text-xl font-bold mb-4">Signal Lost: Product Not Found</div>
                <Link href="/catalog" className="text-primary hover:text-accent underline">Return to Star Chart</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 bg-background flex justify-center items-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-5xl w-full bg-card/50 backdrop-blur-md rounded-3xl shadow-2xl border border-border/50 overflow-hidden flex flex-col md:flex-row relative z-10 transition-colors">
                {/* Visual Side */}
                <div className="p-10 md:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-black text-white flex flex-col justify-between relative overflow-hidden group">
                    {/* Animated Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10">
                        <Link href="/catalog" className="text-indigo-200 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Catalog
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">{product.name}</h1>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-sm font-medium text-indigo-100">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            {product.type === 'key' ? 'License Key' : 'Account Credentials'}
                        </div>
                    </div>

                    <div className="relative z-10 mt-12">
                        <p className="text-sm text-indigo-300 font-medium tracking-widest uppercase mb-1">Price</p>
                        <p className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">${product.price}</p>
                    </div>
                </div>

                {/* Details Side */}
                <div className="p-10 md:w-1/2 flex flex-col justify-center bg-card">
                    <h2 className="text-lg font-semibold mb-6 text-foreground flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Transmission Details
                    </h2>
                    <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
                        {product.description}
                    </p>

                    <div className="mt-auto">
                        <BuyButton productId={product.id} price={Number(product.price)} />
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Secured by AES-256 Encryption. Instant Delivery via Nebula Network.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
