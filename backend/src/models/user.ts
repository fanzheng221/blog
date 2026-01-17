import pool from './database.js';
import { generateId } from '../utils/generateId.js';
import bcrypt from 'bcryptjs';
import type { User, CreateUserData } from '../types/index.js';

export function createUser(data: CreateUserData): Promise<Omit<User, 'password'>> {
  return new Promise(async (resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const id = generateId();

    try {
      const result = await pool.query(`
        INSERT INTO users (id, username, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, role, avatar, bio, created_at, updated_at
      `, [id, data.username, data.email, hashedPassword]);

      resolve(result.rows[0]);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getUserById(id: string): Promise<Omit<User, 'password'> | undefined> {
  const result = await pool.query(`
    SELECT id, username, email, role, avatar, bio, created_at, updated_at
    FROM users WHERE id = $1
  `, [id]);

  return result.rows[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function getUserByUsername(username: string): Promise<Omit<User, 'password'> | undefined> {
  const result = await pool.query(`
    SELECT id, username, email, role, avatar, bio, created_at, updated_at
    FROM users WHERE username = $1
  `, [username]);

  return result.rows[0];
}

export function validatePassword(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, 'username' | 'avatar' | 'bio'>>
): Promise<Omit<User, 'password'> | undefined> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.username) {
    updates.push(`username = $${paramCount++}`);
    values.push(data.username);
  }
  if (data.avatar !== undefined) {
    updates.push(`avatar = $${paramCount++}`);
    values.push(data.avatar);
  }
  if (data.bio !== undefined) {
    updates.push(`bio = $${paramCount++}`);
    values.push(data.bio);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await pool.query(`
    UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}
    RETURNING id, username, email, role, avatar, bio, created_at, updated_at
  `, values);

  return result.rows[0];
}
