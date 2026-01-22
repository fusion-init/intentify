'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// import apiClient from '@/lib/api-client';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalysisForm({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
    const [query, setQuery] = useState('');
    const [version, setVersion] = useState<'v1' | 'v2'>('v1');

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            console.log(`AnalysisForm: Starting analysis (${version}) for:`, text);

            if (version === 'v2') {
                // Call Intentify 2.0 Backend
                try {
                    // Assuming proxy is set up or direct call. 
                    // Using a relative path that we'll assume proxies to NestJS or we can use full URL if we knew it.
                    // For now, let's assume we call a Next.js API route that we will creating momentarily to proxy to NestJS, 
                    // OR we just use fetch to the likely backend port (usually 3000/3333).
                    // Let's rely on a new Next.js API route to keep it clean: /api/intentify

                    const response = await fetch('/api/intentify2', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: text })
                    });

                    if (!response.ok) {
                        throw new Error(`Backend error: ${response.statusText}`);
                    }

                    return await response.json();
                } catch (error) {
                    console.error('Intentify 2.0 Analysis failed:', error);
                    throw error;
                }
            } else {
                // v1: Local Logic
                await new Promise(resolve => setTimeout(resolve, 800));
                try {
                    const { analyzeQueryLocal } = await import('@/lib/local-analyzer');
                    return analyzeQueryLocal(text);
                } catch (error) {
                    console.error('Local analysis failed:', error);
                    throw error;
                }
            }
        },
        onSuccess: (data) => {
            onAnalysisComplete(data);
        },
        onError: (error) => {
            alert(`Analysis failed: ${error.message || 'Unknown error'}. Check console.`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        mutation.mutate(query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={version === 'v2' ? "Intentify 2.0: Enter query..." : "Enter a search query to analyze..."}
                    className="w-full px-6 py-4 text-lg text-gray-900 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none pr-32 transition-all"
                    disabled={mutation.isPending}
                />

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="absolute right-2 top-2 p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                    {mutation.isPending ? <Loader2 className="animate-spin" /> : <Search />}
                </button>

                {/* Version Toggle Dropdown */}
                <div className="absolute right-14 top-3">
                    <select
                        value={version}
                        onChange={(e) => setVersion(e.target.value as 'v1' | 'v2')}
                        className="text-xs font-medium text-gray-500 bg-gray-50 border-0 rounded-lg cursor-pointer hover:bg-gray-100 focus:ring-0 py-1 pl-2 pr-1"
                        disabled={mutation.isPending}
                    >
                        <option value="v1">v1 (Local)</option>
                        <option value="v2">v2 (Intentify)</option>
                    </select>
                </div>
            </div>
            {version === 'v2' && (
                <div className="flex justify-between items-center px-2 mt-2">
                    <p className="text-xs text-blue-600 font-medium">✨ Powered by Intentify 2.0 Rule Engine</p>
                    {statusMessage && <p className="text-xs text-red-500 font-semibold">{statusMessage}</p>}
                </div>
            )}
        </form>
    );
}
