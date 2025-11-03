import Database from "better-sqlite3";
import { createTables, User } from "./schema";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "app.db");
const db = new Database(dbPath);

console.log('[DB] Initializing database at:', dbPath);
db.exec(createTables);

const testUserEmail = 'test@example.com';
const existingTestUser = db.prepare('SELECT * FROM users WHERE email = ?').get(testUserEmail);
if (!existingTestUser) {
  console.log('[DB] Creating test user...');
  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, firstName, lastName, gender, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    stmt.run(
      'test-user-123',
      testUserEmail,
      'Test',
      'User',
      'male',
      'password123',
      now,
      now
    );
    console.log('[DB] Test user created successfully');
  } catch (error) {
    console.error('[DB] Error creating test user:', error);
  }
} else {
  console.log('[DB] Test user already exists');
}

export const userDb = {
  findByEmail: (email: string): User | undefined => {
    try {
      const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
      return stmt.get(email) as User | undefined;
    } catch (error) {
      console.error('[DB] Error finding user by email:', error);
      throw new Error('Database error while finding user by email');
    }
  },

  findById: (id: string): User | undefined => {
    try {
      const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
      return stmt.get(id) as User | undefined;
    } catch (error) {
      console.error('[DB] Error finding user by id:', error);
      throw new Error('Database error while finding user by id');
    }
  },

  create: (user: Omit<User, "createdAt" | "updatedAt">): User => {
    try {
      const now = new Date().toISOString();
      const stmt = db.prepare(`
        INSERT INTO users (id, email, firstName, lastName, gender, password, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        user.id,
        user.email,
        user.firstName,
        user.lastName,
        user.gender,
        user.password,
        now,
        now
      );

      return {
        ...user,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      console.error('[DB] Error creating user:', error);
      throw new Error('Database error while creating user');
    }
  },

  update: (
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): User | undefined => {
    const user = userDb.findById(id);
    if (!user) return undefined;

    const now = new Date().toISOString();
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) return user;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const stmt = db.prepare(`
      UPDATE users 
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(...values, now, id);

    return userDb.findById(id);
  },

  delete: (id: string): boolean => {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  list: (): User[] => {
    const stmt = db.prepare("SELECT * FROM users ORDER BY createdAt DESC");
    return stmt.all() as User[];
  },
};

export default db;
