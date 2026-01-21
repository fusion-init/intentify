'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Clock, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // Need to add date-fns if not present, otherwise use simpleformatter
// actually let's implement a simple formatter to avoid dep if possible, or assume installation.
// I'll stick to simple JS for now to reduce errors.

function timeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export function HistoryList() {
    const { data: history, isLoading } = useQuery({
        queryKey: ['history'],
        queryFn: async () => {
            const { data } = await apiClient.get('/history');
            return data;
        },
        refetchInterval: 5000 // Refresh every 5s
    });

    if (isLoading) return <div className="p-4 text-center text-gray-400">Loading history...</div>;
    if (!history?.length) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-12">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <Clock className="w-5 h-5" /> Recent Analyses
            </h3>
            <div className="space-y-3">
                {history.map((item: any) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">{item.query_text}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.intent_type}</span>
                                <span className="text-xs text-gray-400">{timeAgo(item.created_at)}</span>
                            </div>
                        </div>
                        {item.confidence === 'High' && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
