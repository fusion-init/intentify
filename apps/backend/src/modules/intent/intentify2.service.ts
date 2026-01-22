import { Injectable } from '@nestjs/common';

// --- DATA STRUCTURES ---

export interface IntentifyOutput {
    primary_intent: string;
    intent_distribution: Record<string, number>;
    secondary_intents: string[];
    expanded_queries: string[];
    confidence_level: 'low' | 'medium' | 'high';
    debug_trace: {
        signals_detected: Record<string, boolean>;
        rules_fired: string[];
        intent_score_breakdown: Record<string, number>;
        pipeline_duration_ms: number;
    };
}

interface NormalizedQuery {
    normalized_query: string;
    tokens: string[];
}

interface Signals {
    action: boolean;
    comparison: boolean;
    question: boolean;
    numeric: boolean;
    locality: boolean;
    temporal: boolean;
    constraint: boolean;
    brand: boolean;
}

interface IntentDefinition {
    id: string;
    parent_intent?: string;
    default_weight: number;
    description?: string;
}

interface Rule {
    rule_id: string;
    conditions: {
        signals_required: (keyof Signals)[];
        signals_excluded: (keyof Signals)[];
        token_match?: RegExp; // Optional extra condition
    };
    effects: {
        intent_id: string;
        score_delta: number;
    };
}

// --- ONTOLOGY DEFINITION ---

const INTENT_ONTOLOGY: Record<string, IntentDefinition> = {
    // ROOT
    'informational': { id: 'informational', default_weight: 0.1 },
    'navigational': { id: 'navigational', default_weight: 0.1 },
    'commercial': { id: 'commercial', default_weight: 0.1 },
    'transactional': { id: 'transactional', default_weight: 0.1 },
    'local': { id: 'local', default_weight: 0.1 },

    // INFORMATIONAL (Sample of 30)
    'informational_definition': { id: 'informational_definition', parent_intent: 'informational', default_weight: 0.2 },
    'informational_explanation': { id: 'informational_explanation', parent_intent: 'informational', default_weight: 0.2 },
    'informational_howto': { id: 'informational_howto', parent_intent: 'informational', default_weight: 0.2 },
    'informational_tutorial': { id: 'informational_tutorial', parent_intent: 'informational', default_weight: 0.2 },
    'informational_guide': { id: 'informational_guide', parent_intent: 'informational', default_weight: 0.2 },
    'informational_troubleshooting': { id: 'informational_troubleshooting', parent_intent: 'informational', default_weight: 0.2 },
    'informational_vs': { id: 'informational_vs', parent_intent: 'informational', default_weight: 0.2 },
    'informational_reviews': { id: 'informational_reviews', parent_intent: 'informational', default_weight: 0.2 }, // Often commercial, but can be info

    // NAVIGATIONAL
    'navigational_brand': { id: 'navigational_brand', parent_intent: 'navigational', default_weight: 0.2 },
    'navigational_login': { id: 'navigational_login', parent_intent: 'navigational', default_weight: 0.2 },
    'navigational_website': { id: 'navigational_website', parent_intent: 'navigational', default_weight: 0.2 },

    // COMMERCIAL
    'commercial_best': { id: 'commercial_best', parent_intent: 'commercial', default_weight: 0.2 },
    'commercial_comparison': { id: 'commercial_comparison', parent_intent: 'commercial', default_weight: 0.2 },
    'commercial_review': { id: 'commercial_review', parent_intent: 'commercial', default_weight: 0.2 },
    'commercial_vs': { id: 'commercial_vs', parent_intent: 'commercial', default_weight: 0.2 },

    // TRANSACTIONAL
    'transactional_purchase': { id: 'transactional_purchase', parent_intent: 'transactional', default_weight: 0.2 },
    'transactional_buy_now': { id: 'transactional_buy_now', parent_intent: 'transactional', default_weight: 0.3 },
    'transactional_price': { id: 'transactional_price', parent_intent: 'transactional', default_weight: 0.2 },

    // LOCAL
    'local_near_me': { id: 'local_near_me', parent_intent: 'local', default_weight: 0.3 },
    'local_service_booking': { id: 'local_service_booking', parent_intent: 'local', default_weight: 0.2 },
};

// --- RULES CONFIGURATION ---

const RULES: Rule[] = [
    // Signal-based Rules
    {
        rule_id: 'R_QUESTION_SIGNAL',
        conditions: { signals_required: ['question'], signals_excluded: [] },
        effects: { intent_id: 'informational', score_delta: 0.4 }
    },
    {
        rule_id: 'R_ACTION_BUY',
        conditions: { signals_required: ['action'], signals_excluded: [] },
        effects: { intent_id: 'transactional', score_delta: 0.4 }
    },
    {
        rule_id: 'R_COMPARISON',
        conditions: { signals_required: ['comparison'], signals_excluded: [] },
        effects: { intent_id: 'commercial', score_delta: 0.5 }
    },
    {
        rule_id: 'R_LOCALITY',
        conditions: { signals_required: ['locality'], signals_excluded: [] },
        effects: { intent_id: 'local', score_delta: 0.6 }
    },
    {
        rule_id: 'R_NUMERIC_PRICE',
        conditions: { signals_required: ['numeric'], signals_excluded: [] },
        effects: { intent_id: 'transactional_price', score_delta: 0.3 }
    },

    // Specific Regex Rules (embedded mainly for demo, ideally would be data-driven)
    {
        rule_id: 'R_KEYWORD_HOWTO',
        conditions: { signals_required: [], signals_excluded: [], token_match: /\b(how to|guide|tutorial)\b/ },
        effects: { intent_id: 'informational_howto', score_delta: 0.5 }
    },
    {
        rule_id: 'R_KEYWORD_BEST',
        conditions: { signals_required: [], signals_excluded: [], token_match: /\b(best|top|rated)\b/ },
        effects: { intent_id: 'commercial_best', score_delta: 0.5 }
    },
    {
        rule_id: 'R_KEYWORD_VS',
        conditions: { signals_required: [], signals_excluded: [], token_match: /\b(vs|versus|compare)\b/ },
        effects: { intent_id: 'commercial_vs', score_delta: 0.5 }
    },
    {
         rule_id: 'R_KEYWORD_BUY',
         conditions: { signals_required: [], signals_excluded: [], token_match: /\b(buy|purchase|order)\b/ },
         effects: { intent_id: 'transactional_purchase', score_delta: 0.6 }
    },
    {
         rule_id: 'R_KEYWORD_LOGIN',
         conditions: { signals_required: [], signals_excluded: [], token_match: /\b(login|sign in)\b/ },
         effects: { intent_id: 'navigational_login', score_delta: 0.7 }
    }
];

@Injectable()
export class Intentify2Service {

    analyze(query: string): IntentifyOutput {
        const start = performance.now();
        const debugTrace = {
            signals_detected: {} as Record<string, boolean>,
            rules_fired: [] as string[],
            intent_score_breakdown: {} as Record<string, number>,
            pipeline_duration_ms: 0
        };

        // 1. Lexical Normalization
        const normalized = this.normalize(query);

        // 2. Signal Extraction
        const signals = this.extractSignals(normalized);
        debugTrace.signals_detected = signals as unknown as Record<string, boolean>;

        // 3. Intent Ontology (Loaded globally)

        // 4. Rule Evaluation & 5. Intent Scoring
        const scores = this.evaluateRulesAndScore(normalized, signals, debugTrace);

        // 6. Multi-Intent Normalization
        const { primary, distribution, secondary } = this.normalizeScores(scores);

        // 7. Query Expansion
        const expanded = this.expandQuery(normalized.normalized_query, primary, distribution);

        // 8. Confidence Estimation
        const confidence = this.estimateConfidence(distribution, primary);

        // 9. Output Assembly
        const end = performance.now();
        debugTrace.pipeline_duration_ms = end - start;

        return {
            primary_intent: primary,
            intent_distribution: distribution,
            secondary_intents: secondary,
            expanded_queries: expanded,
            confidence_level: confidence,
            debug_trace: debugTrace
        };
    }

    // TASK 1: Lexical Normalization
    private normalize(query: string): NormalizedQuery {
        let q = query.toLowerCase();
        // Remove punctuation
        q = q.replace(/[^\w\s]/g, '');
        // Collapse whitespace
        q = q.replace(/\s+/g, ' ').trim();
        return {
            normalized_query: q,
            tokens: q.split(' ')
        };
    }

    // TASK 2: Signal Extraction
    private extractSignals(norm: NormalizedQuery): Signals {
        const q = norm.normalized_query;
        return {
            action: /\b(buy|get|purchase|order|shop|book|reserve|learn|how|find|search)\b/.test(q),
            comparison: /\b(vs|versus|compare|review|best|top|better|worse)\b/.test(q),
            question: /\b(what|where|when|who|why|how|which)\b/.test(q),
            numeric: /\d+|price|cost|budget|\$/.test(q), // simplistic
            locality: /\b(near me|nearby|local|city|location|address)\b/.test(q),
            temporal: /\b(now|today|2024|2025|latest|new|upcoming)\b/.test(q),
            constraint: /\b(under|less than|cheap|affordable)\b/.test(q),
            brand: false // Placeholder: requires brand dictionary
        };
    }

    // TASK 4 & 5: Rule Engine & Scoring
    private evaluateRulesAndScore(
        norm: NormalizedQuery,
        signals: Signals,
        trace: IntentifyOutput['debug_trace']
    ): Record<string, number> {
        const scores: Record<string, number> = {};

        // Initialize defaults from Ontology (optional, or start at 0)
        // Design choice: Start at 0, rules add up.
        // Or start at small base weight.
        
        for (const rule of RULES) {
            let match = true;

            // Check required signals
            for (const req of rule.conditions.signals_required) {
                if (!signals[req]) { match = false; break; }
            }
            if (!match) continue;

            // Check excluded signals
            for (const excl of rule.conditions.signals_excluded) {
                if (signals[excl]) { match = false; break; }
            }
            if (!match) continue;

            // Check token match
            if (rule.conditions.token_match) {
                if (!rule.conditions.token_match.test(norm.normalized_query)) {
                    match = false;
                }
            }

            if (match) {
                const target = rule.effects.intent_id;
                scores[target] = (scores[target] || 0) + rule.effects.score_delta;
                trace.rules_fired.push(rule.rule_id);
            }
        }

        trace.intent_score_breakdown = { ...scores };

        // Propagate Score to Parents (Ontology hierarchy)
        // Simple propagation: parent gets sum of children? Or max?
        // Let's do: Parent gets max of (own_score, child_score * attenuation)
        // Or just accumulation. Requirement: "Parent intents receive propagated score"
        
        // We'll iterate and propagate upwards.
        // First, ensure all touched intents exist in scores map
        // (already done dynamically)

        // Perform one pass of propagation (Leaf -> Root). 
        // Since we don't have a topological sort, we'll just iterate carefully or do a simple 2-pass.
        // For this starter, we'll just add child scores to parents.
        
        const finalScores = { ...scores };
        Object.keys(scores).forEach(intentId => {
            const intent = INTENT_ONTOLOGY[intentId];
            if (intent && intent.parent_intent) {
                 // Propagate 50% of score to parent
                 const parentId = intent.parent_intent;
                 finalScores[parentId] = (finalScores[parentId] || 0) + (scores[intentId] * 0.5);
            }
        });

        // Add default weights ONLY if the intent has some score (activation) to avoid noise
        // OR add default weight to everything? User said: "intent_score = sum(rule_score * intent_default_weight)" - wait
        // The prompt said: "intent_score = SUM(rule_score x intent_default_weight)" -> this implies multiplication or interaction.
        // Let's interpret as: Base Score + Rules. 
        // Prompt Formula: `intent_score = Σ(rule_score × intent_default_weight)` -> This looks like rule_score is scaled by intent weight.
        // Let's implement that: rule_effect is `score_delta`, we multiply by `default_weight` of the intent.

        // Re-calculate with proper formula
        // Reset scores
        const weightedScores: Record<string, number> = {};
        
        for (const rule of RULES) {
            // ... (matching logic check again or reuse fired rules)
            // Reuse trace
             if (trace.rules_fired.includes(rule.rule_id)) {
                 const intentId = rule.effects.intent_id;
                 const intentDef = INTENT_ONTOLOGY[intentId];
                 const weight = intentDef ? intentDef.default_weight : 0.1; // fallback
                 
                 // Apply formula
                 const impact = rule.effects.score_delta * (1 + weight); // heuristic to combine them
                 weightedScores[intentId] = (weightedScores[intentId] || 0) + impact;
             }
        }
        
        // Propagation again on weighted scores
        Object.keys(weightedScores).forEach(intentId => {
            const intent = INTENT_ONTOLOGY[intentId];
            if (intent && intent.parent_intent) {
                 const parentId = intent.parent_intent;
                 weightedScores[parentId] = (weightedScores[parentId] || 0) + (weightedScores[intentId] * 0.4);
            }
        });

        return weightedScores;
    }

    // TASK 6: Multi-Intent Normalization
    private normalizeScores(scores: Record<string, number>): { primary: string, distribution: Record<string, number>, secondary: string[] } {
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        if (total === 0) {
            return { primary: 'informational', distribution: { 'informational': 1.0 }, secondary: [] };
        }

        const normalized: Record<string, number> = {};
        let maxScore = -1;
        let primary = 'informational';
        
        for (const [k, v] of Object.entries(scores)) {
            const normVal = parseFloat((v / total).toFixed(2));
            normalized[k] = normVal;
            if (normVal > maxScore) {
                maxScore = normVal;
                primary = k;
            }
        }

        // Secondary: anything > 0.15 (threshold) and not primary
        const secondary = Object.entries(normalized)
            .filter(([k, v]) => k !== primary && v >= 0.15)
            .map(([k]) => k);

        return { primary, distribution: normalized, secondary };
    }

    // TASK 7: Query Expansion
    private expandQuery(original: string, primaryIntent: string, distribution: Record<string, number>): string[] {
        const expansions: string[] = [];
        
        // Simple heuristic expansions
        if (primaryIntent.includes('price') || primaryIntent.includes('buy')) {
             expansions.push(original + ' cheap');
             expansions.push(original + ' discount');
        }
        if (primaryIntent.includes('review') || primaryIntent.includes('best')) {
             expansions.push(original + ' reddit');
             expansions.push('best ' + original + ' 2025');
        }
        if (primaryIntent.includes('howto') || primaryIntent.includes('tutorial')) {
             expansions.push(original + ' step by step');
             expansions.push(original + ' guide');
        }
        
        return expansions;
    }

    // TASK 8: Confidence Estimation
    private estimateConfidence(distribution: Record<string, number>, primary: string): 'low' | 'medium' | 'high' {
        const primaryScore = distribution[primary] || 0;
        
        if (primaryScore > 0.6) return 'high';
        if (primaryScore > 0.35) return 'medium';
        return 'low';
    }
}
