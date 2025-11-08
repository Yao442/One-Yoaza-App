export type GhanaRegion = 
  | "Ashanti"
  | "Brong Ahafo"
  | "Central"
  | "Eastern"
  | "Greater Accra"
  | "Northern"
  | "Upper East"
  | "Upper West"
  | "Volta"
  | "Western"
  | "Savannah"
  | "Bono East"
  | "Oti"
  | "Ahafo"
  | "Western North"
  | "North East";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  password: string;
  subscribedRegions: GhanaRegion[];
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
    subscribedRegions TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;
