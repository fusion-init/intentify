import { Module } from '@nestjs/common';
import { Intentify2Controller } from './intentify2.controller';
import { Intentify2Service } from './intentify2.service';
import { LexicalNormalizationService } from './lexical-normalization.service';
import { SignalExtractionService } from './signal-extraction.service';
import { IntentOntologyService } from './intent.ontology.service';
import { RuleEngineService } from './rule-engine.service';
import { IntentScoringService } from './intent-scoring.service';
import { QueryExpansionService } from './query-expansion.service';
import { ConfidenceEstimationService } from './confidence-estimation.service';

@Module({
    controllers: [Intentify2Controller],
    providers: [
        Intentify2Service,
        LexicalNormalizationService,
        SignalExtractionService,
        IntentOntologyService,
        RuleEngineService,
        IntentScoringService,
        QueryExpansionService,
        ConfidenceEstimationService
    ],
    exports: [Intentify2Service]
})
export class Intentify2Module { }
