import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { AVATAR_DIR } from './profile/avatar-upload.config';
import { configureApp } from './setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  configureApp(app);

  // Ensure the avatar upload folder exists, then serve everything under
  // ./uploads at /uploads/* (e.g. /uploads/avatars/<file>).
  // Local/long-running hosts only — Vercel's filesystem is read-only.
  mkdirSync(join(process.cwd(), AVATAR_DIR), { recursive: true });
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  Logger.log(`VibeLink API running at ${url}/api`, 'Bootstrap');
  Logger.log(`Swagger docs at ${url}/docs`, 'Bootstrap');
}
bootstrap();
