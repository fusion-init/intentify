import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { Intentify2Service } from './intentify2.service';

@Controller('intentify')
export class Intentify2Controller {
    constructor(private readonly intentifyService: Intentify2Service) { }

    @Get('health')
    healthCheck() {
        return {
            status: 'ok',
            service: 'intentify-backend',
            timestamp: new Date().toISOString()
        };
    }

    @Post('analyze')
    async analyze(@Body() body: { query: string }) {
        // 1. INPUT VALIDATION
        if (!body || typeof body.query !== 'string' || !body.query.trim()) {
            throw new HttpException({
                success: false,
                error_code: 'INVALID_QUERY',
                message: 'Query must be a non-empty string.'
            }, HttpStatus.BAD_REQUEST);
        }

        try {
            // 2. EXECUTION
            const result = await this.intentifyService.analyze(body.query);

            // 3. STRICT SUCCESS CONTRACT
            return {
                success: true,
                data: result
            };

        } catch (error: any) {
            // 4. FAIL SAFE (NO RAW 500s)
            console.error('[Backend Error] Analyze failed:', error);

            throw new HttpException({
                success: false,
                error_code: 'INTENTIFY_BACKEND_ERROR',
                message: 'The intent analysis service encountered an internal error.',
                debug: process.env.NODE_ENV !== 'production' ? error.message : undefined
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
