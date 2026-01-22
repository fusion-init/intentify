import { Injectable } from '@nestjs/common';
import { Signals } from './signal-extraction.service';

export interface Rule {
    rule_id: string;
    conditions: {
        signals_required: (keyof Signals)[];
        signals_excluded: (keyof Signals)[];
    };
    effects: {
        intent_id: string;
        score_delta: number;
    };
}

@Injectable()
export class RuleEngineService {
    private rules: Rule[] = [];

    constructor() {
        this.initializeRules();
    }

    private initializeRules() {
        // --- COMMERCIAL Investigation Rules ---
        this.addRule('commercial_comparison_strong',
            ['comparison', 'brand'], [],
            'commercial_comparison', 0.5
        );
        this.addRule('commercial_comparison_simple',
            ['comparison'], ['action'],
            'commercial_comparison', 0.3 // Weaker if no brand involved
        );
        this.addRule('commercial_best_generic',
            ['comparison'], ['numeric'], // "best" often triggers comparison signal
            'commercial_best', 0.4
        );
        this.addRule('commercial_review_signal',
            ['brand'], ['action'], // If brand mention without buying action, might be review/research
            'commercial_review', 0.2
        );

        // --- TRANSACTIONAL Rules ---
        this.addRule('transactional_purchase_explicit',
            ['action'], ['question'], // "buy" but not "how to buy" (question might downgrade it)
            'transactional_purchase', 0.6
        );
        this.addRule('transactional_price_numeric',
            ['numeric', 'brand'], ['question'],
            'transactional_price', 0.4
        );

        // --- NAVIGATIONAL Rules ---
        this.addRule('navigational_login_action',
            ['action', 'brand'], [], // "login facebook"
            'navigational_login', 0.7
        );

        // --- LOCAL Rules ---
        this.addRule('local_near_me_implicit',
            ['locality'], [],
            'local_near_me', 0.8
        );

        // --- INFORMATIONAL Rules ---
        this.addRule('informational_question_generic',
            ['question'], ['action', 'numeric', 'locality'],
            'informational', 0.5
        );
    }

    private addRule(id: string, required: (keyof Signals)[], excluded: (keyof Signals)[], intentId: string, score: number) {
        this.rules.push({
            rule_id: id,
            conditions: { signals_required: required, signals_excluded: excluded },
            effects: { intent_id: intentId, score_delta: score }
        });
    }

    evaluate(signals: Signals): { fired_rules: string[], scores: Map<string, number> } {
        const fired_rules: string[] = [];
        const scores = new Map<string, number>();

        for (const rule of this.rules) {
            // Check Required
            const allRequired = rule.conditions.signals_required.every(s => signals[s]);
            if (!allRequired) continue;

            // Check Excluded
            const anyExcluded = rule.conditions.signals_excluded.some(s => signals[s]);
            if (anyExcluded) continue;

            // Fire Rule
            fired_rules.push(rule.rule_id);

            const current = scores.get(rule.effects.intent_id) || 0;
            scores.set(rule.effects.intent_id, current + rule.effects.score_delta);
        }

        return { fired_rules, scores };
    }
}
