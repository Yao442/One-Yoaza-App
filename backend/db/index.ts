import { User } from "./schema";

console.log('🗄️  Initializing in-memory database...');

const users: Map<string, User> = new Map();

const userDb = {
  findByEmail: (email: string): User | undefined => {
    for (const user of users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  },

  findById: (id: string): User | undefined => {
    return users.get(id);
  },

  create: (user: Omit<User, "createdAt" | "updatedAt">): User => {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      createdAt: now,
      updatedAt: now,
    };

    users.set(user.id, newUser);
    console.log(`✅ User created: ${user.email} (ID: ${user.id})`);
    return newUser;
  },

  update: (
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): User | undefined => {
    const user = users.get(id);
    if (!user) return undefined;

    const now = new Date().toISOString();
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: now,
    };

    users.set(id, updatedUser);
    return updatedUser;
  },

  delete: (id: string): boolean => {
    return users.delete(id);
  },

  list: (): User[] => {
    return Array.from(users.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};

try {
  const testUser = userDb.findByEmail('test@example.com');
  if (!testUser) {
    console.log('🌱 Seeding test user...');
    userDb.create({
      id: 'test-user-id',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      gender: 'male',
    });
    console.log('✅ Test user seeded successfully');
    console.log('🔑 Login credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
  }
  console.log('✅ In-memory database initialized');
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  throw error;
}

export { userDb };
