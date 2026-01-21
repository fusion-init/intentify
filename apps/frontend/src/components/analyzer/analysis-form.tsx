'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalysisForm({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
    const [query, setQuery] = useState('');

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            const { data } = await apiClient.post('/analyze', { query: text });
            return data;
        },
        onSuccess: (data) => {
            onAnalysisComplete(data);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        mutation.mutate(query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter a search query to analyze..."
                    className="w-full px-6 py-4 text-lg text-gray-900 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                    disabled={mutation.isPending}
                />
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="absolute right-2 top-2 p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                    {mutation.isPending ? <Loader2 className="animate-spin" /> : <Search />}
                </button>
            </div>
        </form>
    );
}
