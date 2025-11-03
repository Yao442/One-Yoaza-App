export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  password: string;
  createdAt: string;
  updatedAt: string;
}

export const createTables = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    password TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;
