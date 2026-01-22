'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// import apiClient from '@/lib/api-client';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalysisForm({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
    const [query, setQuery] = useState('');
    const [version, setVersion] = useState<'v1' | 'v2'>('v1');
    const [backendHealth, setBackendHealth] = useState<'ok' | 'down' | 'checking'>('checking');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // 1. HEALTH CHECK ON MOUNT
    useState(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch('/api/health');
                if (res.ok) {
                    setBackendHealth('ok');
                } else {
                    setBackendHealth('down');
                    setStatusMessage("Intentify Backend is currently unreachable.");
                }
            } catch (e) {
                setBackendHealth('down');
                setStatusMessage("Intentify Backend is offline.");
            }
        };
        checkHealth();
    });

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            console.log(`AnalysisForm: Starting analysis (${version}) for:`, text);
            setStatusMessage(null);

            if (version === 'v2') {
                if (backendHealth !== 'ok') {
                    throw new Error("Backend is offline. Cannot perform analysis.");
                }

                try {
                    // Call our Hardened Proxy
                    const response = await fetch('/api/intentify2', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: text })
                    });

                    const data = await response.json();

                    // FRONTEND ERROR GUARD
                    if (!data.success && !response.ok) {
                        throw new Error(data.message || `Error ${data.error_code || 'UNKNOWN'}`);
                    }

                    if (!data.success) {
                        throw new Error(data.message || "Analysis failed due to invalid input.");
                    }

                    return data.data;
                } catch (error: any) {
                    console.error('Intentify 2.0 Analysis failed:', error);
                    throw error;
                }
            } else {
                // v1: Local Logic
                await new Promise(resolve => setTimeout(resolve, 800));
                return (await import('@/lib/local-analyzer')).analyzeQueryLocal(text);
            }
        },
        onSuccess: (data) => {
            onAnalysisComplete(data);
        },
        onError: (error) => {
            setStatusMessage(error.message || 'An unexpected error occurred.');
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
                    placeholder={
                        backendHealth === 'down' && version === 'v2'
                            ? "⚠ Backend Offline - Check Server"
                            : version === 'v2' ? "Intentify 2.0: Enter query..." : "Enter a search query to analyze..."
                    }
                    className={cn(
                        "w-full px-6 py-4 text-lg text-gray-900 bg-white border rounded-xl shadow-sm focus:outline-none pr-32 transition-all",
                        backendHealth === 'down' && version === 'v2' ? "border-red-300 bg-red-50" : "focus:ring-2 focus:ring-blue-500"
                    )}
                    disabled={mutation.isPending || (version === 'v2' && backendHealth === 'down')}
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
