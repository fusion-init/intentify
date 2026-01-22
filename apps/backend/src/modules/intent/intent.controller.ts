import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { IntentService } from './intent.service';
import { Intentify2Service } from './intentify2.service';
import { AnalyzeQueryDto, BatchAnalyzeDto } from './dto/analyze-query.dto';

@Controller('api/v1/intent')
export class IntentController {
    constructor(
        private readonly intentService: IntentService,
        private readonly intentify2Service: Intentify2Service
    ) { }

    @Post('analyze')
    async analyze(@Body() dto: AnalyzeQueryDto) {
        return this.intentService.analyzeQuery(dto.query);
    }

    @Post('analyze/v2')
    async analyzeV2(@Body() dto: AnalyzeQueryDto) {
        return this.intentify2Service.analyze(dto.query);
    }

    @Post('batch')
    async batchAnalyze(@Body() dto: BatchAnalyzeDto) {
        return this.intentService.batchAnalyze(dto.queries);
    }

    @Get('history')
    async getHistory(@Query('userId') userId: string) {
        return { message: "History implementation pending user module" };
    }
}
