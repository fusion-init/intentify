import { Badge } from 'lucide-react'; // Placeholder types if needed, using custom divs for now
import { cn } from '@/lib/utils';

interface AnalysisResultProps {
    data: any;
}

export function AnalysisResult({ data }: AnalysisResultProps) {
    if (!data) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        data.confidence === 'High' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                        {data.confidence} Confidence
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm text-gray-500 mb-1">Intent Type</h3>
                        <p className="font-semibold text-gray-900">{data.intent_type}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm text-gray-500 mb-1">SEO Priority</h3>
                        <p className="font-semibold text-gray-900">{data.seo_priority || 'Normal'}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm text-gray-500 mb-2">User Goal</h3>
                    <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">{data.user_goal}</p>
                </div>

                <div>
                    <h3 className="text-sm text-gray-500 mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.keywords?.map((k: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">{k}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
