import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

let cachedServer: any;

async function bootstrapServer() {
    if (!cachedServer) {
        const expressApp = express();
        const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
        app.enableCors();
        await app.init();
        cachedServer = expressApp;
    }
    return cachedServer;
}

export default async (req: any, res: any) => {
    const server = await bootstrapServer();
    return server(req, res);
};
