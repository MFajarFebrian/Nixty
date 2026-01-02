'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProduct() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        type: 'key'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        const res = await fetch('http://localhost:3001/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            router.push('/admin/products');
        } else {
            alert('Failed to create product');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Add New Product</h1>
                    <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">Cancel</Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input type="number" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="key">License Key</option>
                                <option value="credential">Account Credential</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-4">
                        Create Product
                    </button>
                </form>
            </div>
        </div>
    );
}
