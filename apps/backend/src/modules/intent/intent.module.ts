import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { IntentController } from './intent.controller';
import { IntentService } from './intent.service';
import { Intentify2Service } from './intentify2.service';
import { IntentResult } from './intent.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([IntentResult]),
        CacheModule.register()
    ],
    controllers: [IntentController],
    providers: [IntentService, Intentify2Service],
    exports: [IntentService, Intentify2Service]
})
export class IntentModule { }
