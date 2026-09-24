export default () => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProduction = nodeEnv === 'production';

  if (isProduction && !process.env.JWT_SECRET) {
    throw new Error('CRITICAL CONFIG ERROR: JWT_SECRET environment variable must be set in production!');
  }

  const rawMongoUri = process.env.MONGODB_URI?.trim();
  const mongodbUri =
    rawMongoUri && rawMongoUri.length > 0
      ? rawMongoUri
      : 'mongodb://127.0.0.1:27017/vibelink';

  return {
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv,
    mongodbUri,
    jwt: {
      secret: process.env.JWT_SECRET ?? 'dev_secret_change_me',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
      refreshSecret:
        process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret_change_me',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
    },
  };
};


