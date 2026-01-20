'use client';

import { useState } from 'react';
import { AnalysisForm } from '@/components/analyzer/analysis-form';
import { AnalysisResult } from '@/components/analyzer/analysis-result';
import { HistoryList } from '@/components/analyzer/history-list';

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Reveal the <span className="text-blue-600">Intent</span> behind queries.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Advanced AI-powered analysis to understand user search intent, extract keywords, and optimize your content strategy.
          </p>
        </div>

        <div className="mt-12">
          <AnalysisForm onAnalysisComplete={setResult} />
        </div>

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AnalysisResult data={result} />
          </div>
        )}

        <HistoryList />
      </div>
    </div>
  );
}
