import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntentModule } from './modules/intent/intent.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'intentify',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV !== 'production',
        }),
        IntentModule,
        AnalyticsModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
