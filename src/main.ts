import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // `origin: true` reflects the request's Origin header, so any client is
  // allowed. Native Flutter (Android/iOS) ignores CORS entirely; this matters
  // only for Flutter Web running in a browser.
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('VibeLink API')
    .setDescription(
      'Backend for the VibeLink Flutter app — real-world social challenges to fight loneliness.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .addTag('profile')
    .addTag('challenges')
    .addTag('memories')
    .addTag('match')
    .addTag('home')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  Logger.log(`VibeLink API running at ${url}/api`, 'Bootstrap');
  Logger.log(`Swagger docs at ${url}/docs`, 'Bootstrap');
}
bootstrap();
