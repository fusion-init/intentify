import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { IntentService } from './intent.service';
import { AnalyzeQueryDto, BatchAnalyzeDto } from './dto/analyze-query.dto';

@Controller('api/v1/intent')
export class IntentController {
    constructor(private readonly intentService: IntentService) { }

    @Post('analyze')
    async analyze(@Body() dto: AnalyzeQueryDto) {
        return this.intentService.analyzeQuery(dto.query);
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
