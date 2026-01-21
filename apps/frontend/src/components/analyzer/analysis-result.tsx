import { BadgeCheck, DollarSign, Target, MapPin, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisResult as AnalysisResultType } from '@/lib/local-analyzer';

interface AnalysisResultProps {
    data: AnalysisResultType;
}

export function AnalysisResult({ data }: AnalysisResultProps) {
    if (!data) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">

                {/* Header: Intent & Confidence */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>
                        <div className="flex gap-2 mt-2">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                                data.primary_intent === 'Transactional' ? "bg-purple-100 text-purple-700" :
                                    data.primary_intent === 'Commercial_Investigation' ? "bg-blue-100 text-blue-700" :
                                        data.primary_intent === 'Navigational' ? "bg-yellow-100 text-yellow-700" :
                                            "bg-gray-100 text-gray-700"
                            )}>
                                {data.primary_intent.replace('_', ' ')}
                            </span>
                            {data.local_intent && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                    <MapPin className="w-3 h-3" /> Local
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <Layers className="w-4 h-4" />
                            <h3 className="text-xs font-medium uppercase tracking-wide">Funnel Stage</h3>
                        </div>
                        <p className="font-semibold text-gray-900 capitalize">{data.funnel_stage.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <DollarSign className="w-4 h-4" />
                            <h3 className="text-xs font-medium uppercase tracking-wide">Commercial Value</h3>
                        </div>
                        <p className={cn(
                            "font-semibold capitalize",
                            data.commercial_value === 'high' ? "text-green-600" :
                                data.commercial_value === 'medium' ? "text-yellow-600" : "text-gray-600"
                        )}>
                            {data.commercial_value}
                        </p>
                    </div>
                </div>

                {/* User Goal */}
                <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" /> User Goal
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                        {data.user_goal}
                    </p>
                </div>

                {/* Metadata Tags */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                        <span className="text-xs text-gray-400 mr-2 uppercase tracking-wide">Action:</span>
                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded capitalize">{data.action_intent.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 mr-2 uppercase tracking-wide">Content Type:</span>
                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded capitalize">{data.content_type_required.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 mr-2 uppercase tracking-wide">Domain:</span>
                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded capitalize">{data.industry_domain}</span>
                    </div>

                    {data.secondary_intents.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {data.secondary_intents.map((intent) => (
                                <span key={intent} className="px-2 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded text-xs">
                                    {intent}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
