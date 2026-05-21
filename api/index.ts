import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import type { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

const server = express();
let isInitialized = false;

async function bootstrap() {
  if (!isInitialized) {
    const adapter = new ExpressAdapter(server);
    const app = await NestFactory.create(AppModule, adapter, { logger: ['error', 'warn'] });

    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: false }));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('api');

    await app.init();
    isInitialized = true;
  }
}

export default async function handler(req: Request, res: Response) {
  await bootstrap();
  server(req, res);
}
