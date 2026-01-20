export interface AnalyzedIntent {
    query: string;
    intent: string;
    confidence: number;
    timestamp: Date;
}

export interface User {
    id: string;
    email: string;
    name?: string;
}
