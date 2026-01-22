'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// import apiClient from '@/lib/api-client';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalysisForm({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
    const [query, setQuery] = useState('');

    const [analyzerMode, setAnalyzerMode] = useState<'v1' | 'v2'>('v1');

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            if (analyzerMode === 'v2') {
                console.log('AnalysisForm: Starting Intentify 2.0 server analysis for:', text);
                const { default: apiClient } = await import('@/lib/api-client');
                const response = await apiClient.post('/v1/intent/analyze/v2', { query: text });
                console.log('AnalysisForm: Server analysis complete:', response.data);
                return response.data;
            }

            console.log('AnalysisForm: Starting local analysis for:', text);
            // Simulate network delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            try {
                // Dynamically import to ensure client-side execution
                const { analyzeQueryLocal } = await import('@/lib/local-analyzer');
                const data = analyzeQueryLocal(text);
                console.log('AnalysisForm: Local analysis complete:', data);
                return data;
            } catch (error) {
                console.error('AnalysisForm: Local analysis failed:', error);
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log('AnalysisForm: Mutation onSuccess triggered');
            onAnalysisComplete(data);
        },

        onError: (error) => {
            console.error('AnalysisForm: Mutation onError triggered:', error);
            // Optionally set some local error state here if UI needs to show it
            alert(`Analysis failed: ${error.message || 'Unknown error'}. Check console.`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('AnalysisForm: Form submitted. Query:', query);
        if (!query.trim()) {
            console.warn('AnalysisForm: Query is empty, aborting.');
            return;
        }
        mutation.mutate(query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="relative flex gap-2">
                <div className="relative">
                    <select
                        value={analyzerMode}
                        onChange={(e) => setAnalyzerMode(e.target.value as 'v1' | 'v2')}
                        className="h-full pl-4 pr-8 py-4 text-gray-700 bg-gray-50 border border-r-0 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                        disabled={mutation.isPending}
                    >
                        <option value="v1">Local (v1)</option>
                        <option value="v2">Intentify 2.0</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter a search query to analyze..."
                        className="w-full px-6 py-4 text-lg text-gray-900 bg-white border rounded-r-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
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
            </div>
        </form>
    );
}
