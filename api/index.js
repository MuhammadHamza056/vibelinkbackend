// Vercel serverless entry point for the NestJS app.
//
// We require the tsc-compiled output in ../dist (produced by `nest build`,
// configured as the Vercel build command) rather than the TypeScript sources.
// Vercel bundles functions with esbuild, which does NOT emit decorator
// metadata — that would break NestJS dependency injection. tsc-compiled JS
// already carries the metadata, so DI works correctly.

const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const expressApp = express();

// Reuse a single bootstrapped Nest instance across warm invocations.
let bootstrapPromise;

async function bootstrap() {
  // Required lazily (inside the try/catch in the handler) so a missing
  // compiled bundle surfaces as a clean error instead of an opaque crash.
  const { AppModule } = require('../dist/app.module');
  const { configureApp } = require('../dist/setup');

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn'],
  });
  configureApp(app);
  await app.init();
  return expressApp;
}

module.exports = async (req, res) => {
  try {
    if (!bootstrapPromise) {
      bootstrapPromise = bootstrap();
    }
    await bootstrapPromise;
  } catch (err) {
    // Don't cache a failed boot — let the next request retry (e.g. transient
    // DB connectivity). Also surface the real reason in the response + logs.
    bootstrapPromise = undefined;
    console.error('Nest bootstrap failed:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        statusCode: 500,
        message: 'Server failed to start',
        error: err && err.message ? err.message : String(err),
      }),
    );
    return;
  }
  return expressApp(req, res);
};
