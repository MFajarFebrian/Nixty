'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (data.user.role !== 'admin') {
                setError('Access denied. Admin only.');
                return;
            }
            // Simple approach: Store token in localStorage (For a real app, use HTTP-only cookies)
            localStorage.setItem('token', data.token);
            router.push('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-card p-8 rounded-xl shadow-md w-full max-w-md border border-border">
                <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Admin Login</h1>
                {error && <div className="bg-destructive/10 text-destructive p-3 rounded mb-4 border border-destructive/20">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-input bg-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-foreground"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-input bg-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-foreground"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
