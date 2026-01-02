import Link from 'next/link';
import { fetchProducts } from '@/lib/api'; // We might show featured products later

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col pt-16">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/50 via-background to-background">
        {/* Space Dust / Stars Effect (Simplified CSS) */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-10 left-20 w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4 backdrop-blur-sm">
            🚀 The Future of Software Delivery
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
            Premium Software. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Instantly Delivered.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Secure, automated, and instant access to the best software licenses and accounts.
            Powered by a headless architecture throughout the galaxy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog" className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-1">
              Browse Catalog
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-full border border-muted-foreground/20 bg-accent/5 text-accent-foreground font-semibold hover:bg-accent/10 transition-all backdrop-blur-sm">
              Customer Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Snippet */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Delivery</h3>
            <p className="text-muted-foreground">Receive your license keys or credentials immediately after payment verification.</p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
              🔒
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Encryption</h3>
            <p className="text-muted-foreground">All sensitive data is AES-256 encrypted. Only you have the key to your purchase.</p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border hover:border-pink-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
              🌌
            </div>
            <h3 className="text-xl font-bold mb-3">Galaxy Support</h3>
            <p className="text-muted-foreground">24/7 support from across the universe to ensure your software works perfectly.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
