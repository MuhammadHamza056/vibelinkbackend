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
const { AppModule } = require('../dist/app.module');
const { configureApp } = require('../dist/setup');

const expressApp = express();

// Reuse a single bootstrapped Nest instance across warm invocations.
let bootstrapPromise;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  configureApp(app);
  await app.init();
  return expressApp;
}

module.exports = async (req, res) => {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap();
  }
  await bootstrapPromise;
  return expressApp(req, res);
};
