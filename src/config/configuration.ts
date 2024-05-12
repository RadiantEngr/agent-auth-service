export default () => ({
    node_env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 4040,
    db: {
      host: process.env.DB_HOST,
      post: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    jwt: {
      secret: process.env.JWT_SECRET_KEY,
      secretexpiry: process.env.JWT_EXPIRATION_TIME
    },
    api: {
      version: process.env.API_VERSION
    }
});
