import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IntentResult } from './intent.entity';
import { AnalyzeQueryDto } from './dto/analyze-query.dto';
import * as crypto from 'crypto';

@Injectable()
export class IntentService {
    constructor(
        @InjectRepository(IntentResult)
        private intentRepository: Repository<IntentResult>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    private hashQuery(query: string): string {
        return crypto.createHash('sha256').update(query).digest('hex');
    }

    async analyzeQuery(query: string): Promise<any> {
        const hash = this.hashQuery(query);

        // Level 1: Redis/Memory Cache
        const cached = await this.cacheManager.get(`intent:${hash}`);
        if (cached) return cached;

        // Level 2: Database Cache
        const dbCache = await this.intentRepository.findOne({ where: { query_hash: hash } });
        if (dbCache) {
            await this.cacheManager.set(`intent:${hash}`, dbCache.result, 3600000); // 1 hour
            // update hit count async
            this.intentRepository.increment({ id: dbCache.id }, 'cache_hits', 1);
            return dbCache.result;
        }

        // Miss: Call AI API (Mocked for now)
        const result = await this.mockClaudeAnalysis(query);

        // Save to DB and Cache
        await this.intentRepository.save({
            query_hash: hash,
            query_text: query,
            result: result,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });
        await this.cacheManager.set(`intent:${hash}`, result, 3600000);

        return result;
    }

    async batchAnalyze(queries: string[]): Promise<any[]> {
        return Promise.all(queries.map(q => this.analyzeQuery(q)));
    }

    private async mockClaudeAnalysis(query: string) {
        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            intent_type: "Commercial Investigation",
            confidence: "High",
            user_goal: `Analyze: ${query}`,
            keywords: query.split(' '),
            timestamp: new Date()
        };
    }
}
