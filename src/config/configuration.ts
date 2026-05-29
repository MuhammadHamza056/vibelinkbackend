export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri: process.env.MONGODB_URI ?? '',
  jwt: {
    // Short-lived token used to call the APIs.
    secret: process.env.JWT_SECRET ?? 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    // Long-lived token used only to mint fresh access tokens.
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret_change_me',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  },
});
