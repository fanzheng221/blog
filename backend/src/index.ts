import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { initializeDatabase, seedDatabase, migrateDatabase } from './models/database.js';
import { publishScheduledArticles } from './models/article.js';
import apiRoutes from './routes/index.js';

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }));
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api', apiRoutes);

  // Error handling
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });

  // Initialize database
  await initializeDatabase();
  await migrateDatabase(); // Run migrations
  await seedDatabase();

  // Start scheduled task: check and publish articles every minute
  setInterval(async () => {
    try {
      const count = await publishScheduledArticles();
      if (count > 0) {
        console.log(`Published ${count} scheduled article(s)`);
      }
    } catch (error) {
      console.error('Error publishing scheduled articles:', error);
    }
  }, 60 * 1000); // Run every minute

  // Start server
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`API: http://localhost:${config.port}/api`);
    console.log('Scheduled publishing task: running (check every 60s)');
  });
}

startServer().catch(console.error);
