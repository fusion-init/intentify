import { LexicalNormalizationService } from './lexical-normalization.service';
import { SignalExtractionService } from './signal-extraction.service';
import { IntentOntologyService } from './intent.ontology.service';
import { RuleEngineService } from './rule-engine.service';
import { IntentScoringService } from './intent-scoring.service';
import { QueryExpansionService } from './query-expansion.service';
import { ConfidenceEstimationService } from './confidence-estimation.service';
import { Intentify2Service } from './intentify2.service';

async function runTest() {
    console.log("Initializing services...");

    try {
        const normalization = new LexicalNormalizationService();
        const signal = new SignalExtractionService();
        const ontology = new IntentOntologyService();
        const rule = new RuleEngineService();
        const scoring = new IntentScoringService(ontology);
        const expansion = new QueryExpansionService();
        const confidence = new ConfidenceEstimationService();

        const mainService = new Intentify2Service(
            normalization,
            signal,
            ontology,
            rule,
            scoring,
            expansion,
            confidence
        );

        console.log("Services initialized. valid.");

        const query = "best laptop for coding";
        console.log(`Testing query: "${query}"`);

        const result = await mainService.analyze(query);
        console.log("Result:", JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("FATAL ERROR:", error);
    }
}

runTest();
