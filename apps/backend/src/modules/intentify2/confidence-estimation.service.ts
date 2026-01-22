import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfidenceEstimationService {

    estimate(
        primaryScore: number,
        scoreDiffToSecondary: number,
        signalCount: number
    ): 'low' | 'medium' | 'high' {

        // Heuristics

        // 1. Score Dominance
        if (primaryScore > 0.7 && scoreDiffToSecondary > 0.3) {
            return 'high';
        }

        // 2. Corroborating Signals
        if (signalCount >= 3 && primaryScore > 0.5) {
            return 'high';
        }

        // 3. Medium Cases
        if (primaryScore > 0.4) {
            return 'medium';
        }

        // 4. Default Low
        return 'low';
    }
}
