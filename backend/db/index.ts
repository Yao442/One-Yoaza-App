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

db.exec(createTables);

export const userDb = {
  findByEmail: (email: string): User | undefined => {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email) as User | undefined;
  },

  findById: (id: string): User | undefined => {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id) as User | undefined;
  },

  create: (user: Omit<User, "createdAt" | "updatedAt">): User => {
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
