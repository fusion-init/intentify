import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryExpansionService {

    expand(query: string, primaryIntent: string, tokens: string[]): string[] {
        const expansions: string[] = [];

        // 1. Intent-Aware Expansion
        if (primaryIntent.startsWith('commercial')) {
            expansions.push(`${query} review`);
            expansions.push(`${query} vs`);
            expansions.push(`best ${query}`);
        } else if (primaryIntent.startsWith('transactional')) {
            expansions.push(`buy ${query}`);
            expansions.push(`${query} price`);
            expansions.push(`${query} discount`);
        } else if (primaryIntent.startsWith('informational')) {
            expansions.push(`what is ${query}`);
            expansions.push(`${query} guide`);
            expansions.push(`how to ${query}`); // Naive for noun phrases
        } else if (primaryIntent.startsWith('local')) {
            expansions.push(`${query} near me`);
            expansions.push(`${query} hours`);
        }

        // 2. Entity-Aware Expansion (Mocked without Entity Recognition)
        // If we identified "iphone", we might expand to "iphone 15", "iphone pro".

        // 3. Synonym Expansion (Simple)
        const synonyms: Record<string, string[]> = {
            'laptop': ['notebook', 'computer'],
            'phone': ['smartphone', 'mobile'],
            'coding': ['programming', 'development'],
            'buy': ['purchase', 'order'],
            'best': ['top', 'rated']
        };

        for (const token of tokens) {
            if (synonyms[token]) {
                synonyms[token].forEach(syn => {
                    // Create a variation by replacing the token
                    expansions.push(query.replace(token, syn));
                });
            }
        }

        return [...new Set(expansions)].slice(0, 5); // Return unique top 5
    }
}
