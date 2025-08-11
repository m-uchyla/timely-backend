import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
}
// eslint-disable-next-line no-void
void bootstrap();
