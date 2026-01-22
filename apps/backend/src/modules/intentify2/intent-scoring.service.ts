import { Injectable } from '@nestjs/common';
import { IntentOntologyService, IntentNode } from './intent.ontology.service';

@Injectable()
export class IntentScoringService {

    constructor(private ontologyService: IntentOntologyService) { }

    calculateScores(ruleScores: Map<string, number>): Map<string, number> {
        const finalScores = new Map<string, number>();

        // 1. Initialize with default weights from Ontology
        const allIntents = this.ontologyService.getAllIntents();
        for (const intent of allIntents) {
            // Base score often starts low, rules boost it. 
            // Or we treat default_weight as a multiplier or baseline.
            // Let's treat it as a small baseline probability
            finalScores.set(intent.id, 0.05); // Tiny baseline
        }

        // 2. Apply Rule Scores
        for (const [intentId, scoreDelta] of ruleScores.entries()) {
            const current = finalScores.get(intentId) || 0;
            finalScores.set(intentId, current + scoreDelta);
        }

        // 3. Propagate to Parents (Bubble up)
        // We need to traverse efficiently. Since depth is shallow, iterating multiple times or topological sort works.
        // Let's do a simple pass.
        // NOTE: A more robust way is recursive but careful of cycles (tree structure assumed).

        let changed = true;
        while (changed) {
            changed = false;
            for (const intent of allIntents) {
                if (intent.parent_id) {
                    const childScore = finalScores.get(intent.id) || 0;
                    const parentScore = finalScores.get(intent.parent_id) || 0;

                    // Simple propagation: parent gets a fraction of child's max score
                    // or cumulative. Let's do cumulative but dampened.
                    const contribution = childScore * 0.2; // Parent gets 20% of child's confidence

                    // This is tricky because we don't want to double count or infinite loop.
                    // For "Classification", usually child implies parent.
                    // So Parent Score = Max(Parent Score, Child Score) often works well.
                    // Let's take Max approach for strong typing.
                    if (childScore > parentScore) {
                        finalScores.set(intent.parent_id, childScore);
                        changed = true;
                    }
                }
            }
        }

        return finalScores;
    }

    normalize(scores: Map<string, number>): {
        primary: string,
        distribution: Record<string, number>,
        secondary: string[]
    } {
        // 1. Normalize to sum = 1.0 (Softmax or Linear)
        // Linear normalization often easier for debug.
        let total = 0;
        for (const s of scores.values()) total += s;

        const normalized = new Map<string, number>();
        if (total === 0) {
            // Uniform or empty?
            return { primary: 'unknown', distribution: {}, secondary: [] };
        }

        for (const [k, v] of scores.entries()) {
            normalized.set(k, parseFloat((v / total).toFixed(4)));
        }

        // 2. Find Primary and Secondaries
        let maxScore = -1;
        let primary = 'unknown';

        const sorted = Array.from(normalized.entries()).sort((a, b) => b[1] - a[1]);

        if (sorted.length > 0) {
            primary = sorted[0][0];
            maxScore = sorted[0][1];
        }

        const THRESHOLD = 0.15; // Threshold for secondary
        const secondary = sorted
            .filter(item => item[0] !== primary && item[1] >= THRESHOLD)
            .map(item => item[0]);

        // Convert Map to Record
        const distribution: Record<string, number> = {};
        for (const [k, v] of normalized.entries()) {
            if (v > 0.01) distribution[k] = v; // Filter noise
        }

        return {
            primary,
            distribution,
            secondary
        };
    }
}
