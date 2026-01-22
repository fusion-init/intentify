import { Injectable } from '@nestjs/common';
import { LexicalNormalizationService } from './lexical-normalization.service';
import { SignalExtractionService } from './signal-extraction.service';
import { IntentOntologyService } from './intent.ontology.service';
import { RuleEngineService } from './rule-engine.service';
import { IntentScoringService } from './intent-scoring.service';
import { QueryExpansionService } from './query-expansion.service';
import { ConfidenceEstimationService } from './confidence-estimation.service';

@Injectable()
export class Intentify2Service {
    constructor(
        private normalizationService: LexicalNormalizationService,
        private signalService: SignalExtractionService,
        private ontologyService: IntentOntologyService,
        private ruleEngine: RuleEngineService,
        private intentScoring: IntentScoringService,
        private expansionService: QueryExpansionService,
        private confidenceService: ConfidenceEstimationService,
    ) { }

    async analyze(query: string): Promise<any> {
        // 1. Lexical Normalization
        const { normalized_query, tokens } = this.normalizationService.normalize(query);

        // 2. Signal Extraction
        const signals = this.signalService.extract(tokens);

        // 3. Rule Evaluation (Ontology is used inside Scoring/Rules references)
        const { fired_rules, scores: ruleScores } = this.ruleEngine.evaluate(signals);

        // 4. Intent Scoring & 5. Normalization
        const rawScores = this.intentScoring.calculateScores(ruleScores);
        const { primary, distribution, secondary } = this.intentScoring.normalize(rawScores);

        // 6. Query Expansion
        const expanded_queries = this.expansionService.expand(normalized_query, primary, tokens);

        // 7. Confidence Estimation
        const primaryScore = distribution[primary] || 0;
        const secondaryScore = secondary.length > 0 ? distribution[secondary[0]] : 0;
        // Count true signals
        const signalCount = Object.values(signals).filter(Boolean).length;

        const confidence_level = this.confidenceService.estimate(
            primaryScore,
            primaryScore - secondaryScore,
            signalCount
        );

        // 8. Output Assembly with Debug Trace
        return {
            primary_intent: primary,
            intent_distribution: distribution,
            secondary_intents: secondary,
            expanded_queries,
            confidence_level,
            debug_trace: {
                original_query: query,
                normalized_query,
                signals_detected: signals,
                rules_fired: fired_rules,
                intent_score_breakdown: Object.fromEntries(rawScores)
            }
        };
    }
}
