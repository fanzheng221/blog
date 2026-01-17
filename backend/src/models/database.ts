import pg from 'pg';
import { config } from '../config/index.js';
import { generateId } from '../utils/generateId.js';

const { Pool } = pg;

// Create connection pool
// Support both DATABASE_URL (Railway) and individual params (local)
export const pool = config.databaseUrl
  ? new Pool({
      connectionString: config.databaseUrl,
    })
  : new Pool({
      host: config.pgHost,
      port: config.pgPort,
      database: config.pgDatabase,
      user: config.pgUser,
      password: config.pgPassword,
    });

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');

    // Create tables if not exists
    await createTables();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

async function createTables() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        avatar TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Articles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        cover_image TEXT,
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        featured BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'published',
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Article tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS article_tags (
        article_id TEXT REFERENCES articles(id) ON DELETE CASCADE,
        tag VARCHAR(100) NOT NULL,
        PRIMARY KEY (article_id, tag)
      )
    `);

    // Comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        parent_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = TRUE`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id)`);

    await client.query('COMMIT');
    console.log('Database tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Migration: Add scheduled publishing fields
export async function migrateDatabase() {
  const client = await pool.connect();

  try {
    // Check if status column exists
    const columnCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'articles' AND column_name = 'status'
    `);

    if (columnCheck.rows.length === 0) {
      await client.query('BEGIN');

      // Add status column
      await client.query(`
        ALTER TABLE articles
        ADD COLUMN status VARCHAR(20) DEFAULT 'published'
      `);

      // Add published_at column
      await client.query(`
        ALTER TABLE articles
        ADD COLUMN published_at TIMESTAMP
      `);

      // Set existing articles as published
      await client.query(`
        UPDATE articles
        SET status = 'published', published_at = created_at
        WHERE status IS NULL
      `);

      // Create indexes
      await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at)`);

      await client.query('COMMIT');
      console.log('Database migration completed: added scheduled publishing support');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database migration error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Seed initial data
export async function seedDatabase() {
  const client = await pool.connect();

  try {
    // Check if admin user exists
    const userResult = await client.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(userResult.rows[0].count);

    if (userCount === 0) {
      await client.query('BEGIN');

      // Create admin user (password: admin123)
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('admin123', 10);

      const adminId = generateId();
      await client.query(`
        INSERT INTO users (id, username, email, password, role, bio)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [adminId, 'admin', 'admin@blog.com', hashedPassword, 'admin', 'Blog administrator']);

      // Create categories
      const categories = [
        { id: generateId(), name: '设计', slug: 'design' },
        { id: generateId(), name: '开发', slug: 'development' },
        { id: generateId(), name: '科技', slug: 'technology' },
        { id: generateId(), name: '生活', slug: 'life' },
      ];

      for (const cat of categories) {
        await client.query(`INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3)`,
          [cat.id, cat.name, cat.slug]);
      }

      await client.query('COMMIT');

      console.log('Database seeded with initial data');
      console.log('Admin user created:');
      console.log('  Email: admin@blog.com');
      console.log('  Password: admin123');
    } 
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Query helper function
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
}

export default pool;
