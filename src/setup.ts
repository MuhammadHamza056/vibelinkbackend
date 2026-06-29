import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Shared application configuration applied in every environment.
 *
 * Used by both the local entry point (`main.ts`) and the Vercel serverless
 * handler (`api/index.js`) so the two never drift apart.
 *
 * Note: static asset serving for `./uploads` lives only in `main.ts` because
 * Vercel's filesystem is read-only (disk-based avatar uploads don't work there).
 */
export function configureApp(app: NestExpressApplication) {
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
    .addTag('notifications')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // On Vercel's serverless runtime the Swagger UI static assets (CSS/JS) are
  // not served by the function, so the default relative asset URLs 404 and
  // `SwaggerUIBundle` never loads. Point the UI at a CDN instead.
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
  });
}
