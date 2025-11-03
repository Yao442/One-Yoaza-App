import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import signupRoute from "./routes/auth/signup/route";
import loginRoute from "./routes/auth/login/route";
import getMeRoute from "./routes/auth/getMe/route";

console.log('🔧 Building tRPC router...');

try {
  console.log('  ✓ Loading example routes');
  console.log('  ✓ Loading auth routes');
} catch (error) {
  console.error('❌ Failed to load routes:', error);
  throw error;
}

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    signup: signupRoute,
    login: loginRoute,
    getMe: getMeRoute,
  }),
});

console.log('✅ tRPC router built successfully');

export type AppRouter = typeof appRouter;
