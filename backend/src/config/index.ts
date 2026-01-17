import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  // PostgreSQL - support multiple platforms (Zeabur, Railway, local)
  databaseUrl: process.env.DATABASE_URL,
  pgHost: process.env.PG_HOST || process.env.POSTGRES_HOST || 'localhost',
  pgPort: parseInt(process.env.PG_PORT || process.env.POSTGRES_PORT || '5432', 10),
  pgDatabase: process.env.PG_DATABASE || process.env.POSTGRES_DBNAME || 'personal_blog',
  pgUser: process.env.PG_USER || process.env.POSTGRES_USERNAME || 'postgres',
  pgPassword: process.env.PG_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
  // SSL for cloud databases (Zeabur, Railway, etc.)
  pgSsl: process.env.PG_SSL === 'true' || process.env.DATABASE_URL?.includes('sslmode=require'),
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
