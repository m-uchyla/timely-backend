import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import type { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const logger = new Logger('Bootstrap');

  // Custom middleware for request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const { method, url, query } = req;
    const timestamp = new Date().toISOString();

    logger.log(`🚀 [${timestamp}] ${method} ${url}`);
    logger.debug(`📋 Query: ${JSON.stringify(query)}`);

    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // usuwa z requestu pola, które nie są w DTO
      forbidNonWhitelisted: true, // rzuca 400, gdy klient prześle nieznane pola
      transform: true, // konwertuje payload do instancji DTO
      transformOptions: {
        enableImplicitConversion: true, // pozwala np. przekonwertować "123" → 123
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Timely API') // Set the title
    .setDescription('API documentation for the Timely app') // Set the description
    .setVersion('0.1') // Set the version
    .addBearerAuth() // Add authentication if needed
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at /api

  app.enableCors({
    origin: [
      'http://localhost:3001', // Your Next.js frontend
      'http://localhost:3000', // Same origin (if needed)
      // Add your production frontend URL here
      // 'https://your-frontend-domain.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: false, // Set to true if you need to send cookies/auth credentials
  });

  await app.listen(process.env.PORT ?? 3000);

  logger.log('🚀 Application is running!');
  logger.log(`📍 Server: http://localhost:${process.env.PORT ?? 3000}`);
  logger.log(`📚 Swagger: http://localhost:${process.env.PORT ?? 3000}/api`);
  logger.log('🔍 Request logging is enabled - you will see all HTTP requests in the console');
}
// eslint-disable-next-line no-void
void bootstrap();
