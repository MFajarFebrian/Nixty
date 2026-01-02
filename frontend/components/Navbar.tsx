"use client";
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-lg border-b border-border' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] transition-shadow">
                            N
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary group-hover:to-accent transition-all">
                            Nixty
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/catalog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Catalog
                        </Link>
                        {/* 
                           In a real app, logic to show Login/Register or Dashboard/Logout 
                           based on auth state would go here. For now, showing both for demo.
                        */}
                        <Link href="/admin/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Admin
                        </Link>

                        <div className="h-4 w-[1px] bg-border"></div>

                        <ThemeToggle />

                        <Link href="/login" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all">
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button (Simplified) */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button className="text-foreground p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
