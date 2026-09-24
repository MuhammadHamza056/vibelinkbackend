import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp, configureStaticAssets } from './setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableShutdownHooks();
  configureApp(app);
  configureStaticAssets(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  Logger.log(`VibeLink API running at ${url}/api`, 'Bootstrap');
  Logger.log(`Swagger docs at ${url}/docs`, 'Bootstrap');
}
bootstrap();

