import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

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
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
