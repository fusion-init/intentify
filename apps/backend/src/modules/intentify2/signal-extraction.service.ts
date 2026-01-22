import { Injectable } from '@nestjs/common';

export interface Signals {
    action: boolean;
    comparison: boolean;
    question: boolean;
    numeric: boolean;
    locality: boolean;
    temporal: boolean;
    constraint: boolean;
    brand: boolean;
}

@Injectable()
export class SignalExtractionService {
    extract(tokens: string[]): Signals {
        const tokenSet = new Set(tokens);
        const query = tokens.join(' ');

        // Detection Logic (Abstract Signals, NO specific keyword intents here)

        const actionKeywords = ['purchase', 'buy', 'order', 'learn', 'know', 'access', 'login', 'sign', 'get', 'find', 'watch', 'download', 'install'];
        const comparisonKeywords = ['ranking', 'comparison', 'vs', 'difference', 'better', 'best', 'top', 'review', 'alternatives'];
        const questionKeywords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'does', 'is'];
        const numericValues = /\d+/;
        const priceKeywords = ['price', 'cost', 'budget', 'cheap', 'expensive', '$', 'usd'];
        const localityKeywords = ['near', 'nearby', 'location', 'address', 'map', 'directions', 'city', 'town', 'open', 'hours'];
        const temporalKeywords = ['latest', 'new', 'recent', '2024', '2025', '2026', 'today', 'now', 'upcoming'];
        const constraintKeywords = ['under', 'below', 'less', 'than', 'without', 'limit'];
        // Brand signal is hard without a brand DB, but we can look for "official" or known common brands contextually. 
        // For this task, we'll naive check if capitalization was prominent (lost in normalization) or just assume false for now unless we add a specific brand dictionary.
        // Let's add a simple placeholder list.
        const commonBrands = ['google', 'apple', 'microsoft', 'nike', 'amazon', 'facebook', 'twitter', 'instagram'];

        const hasAction = tokens.some(t => actionKeywords.includes(t));
        const hasComparison = tokens.some(t => comparisonKeywords.includes(t));
        const hasQuestion = tokens.some(t => questionKeywords.includes(t));
        const hasNumeric = numericValues.test(query) || tokens.some(t => priceKeywords.includes(t));
        const hasLocality = tokens.some(t => localityKeywords.includes(t));
        const hasTemporal = tokens.some(t => temporalKeywords.includes(t));
        const hasConstraint = tokens.some(t => constraintKeywords.includes(t));
        const hasBrand = tokens.some(t => commonBrands.includes(t));

        return {
            action: hasAction,
            comparison: hasComparison,
            question: hasQuestion,
            numeric: hasNumeric,
            locality: hasLocality,
            temporal: hasTemporal,
            constraint: hasConstraint,
            brand: hasBrand
        };
    }
}
