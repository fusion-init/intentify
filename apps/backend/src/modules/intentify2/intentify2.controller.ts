import { Controller, Post, Body } from '@nestjs/common';
import { Intentify2Service } from './intentify2.service';

@Controller('intentify2')
export class Intentify2Controller {
    constructor(private readonly intentifyService: Intentify2Service) { }

    @Post('analyze')
    async analyze(@Body() body: { query: string }) {
        return this.intentifyService.analyze(body.query);
    }
}
