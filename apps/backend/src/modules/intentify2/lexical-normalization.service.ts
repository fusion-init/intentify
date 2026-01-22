import { Injectable } from '@nestjs/common';

export interface NormalizedOutput {
    normalized_query: string;
    tokens: string[];
}

@Injectable()
export class LexicalNormalizationService {
    normalize(query: string): NormalizedOutput {
        // 1. Lower-case normalization
        let normalized = query.toLowerCase().trim();

        // 2. Punctuation removal (keep semantic ones if needed, but spec says removal)
        // Removing common punctuation: .,!?;:()[]{}"'
        // Keeping hyphens might be useful for some compound words, but standardizing to space is often safer for matching.
        // Let's replace punctuation with spaces to avoid merging words (e.g. "term1,term2" -> "term1 term2")
        normalized = normalized.replace(/[.,!?;:()[\]{}"']/g, ' ');

        // 3. Token stabilization (collapse multiple spaces)
        normalized = normalized.replace(/\s+/g, ' ').trim();

        // 4. Phrase grouping (multi-word detection) - Primitive approach for now
        // Advanced phrase grouping usually requires a dictionary. 
        // For this task, we will stick to basic tokenization but ensure clean tokens.
        const tokens = normalized.split(' ');

        return {
            normalized_query: normalized,
            tokens: tokens
        };
    }
}
