'use client';

import { TrendingUp, Users, Activity } from 'lucide-react';

export default function DashboardPage() {
    // Mock analytics query - in real app would use useQuery
    const isLoading = false;
    const stats = [
        { label: 'Total Queries', value: '1,234', icon: Activity, color: 'text-blue-500' },
        { label: 'Active Users', value: '89', icon: Users, color: 'text-green-500' },
        { label: 'Avg. Confidence', value: '92%', icon: TrendingUp, color: 'text-purple-500' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px] flex items-center justify-center text-gray-400">
                Chart Placeholder (Recharts Integration)
            </div>
        </div>
    );
}
