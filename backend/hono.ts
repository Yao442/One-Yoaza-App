import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

console.log('🚀 Starting backend server...');

const app = new Hono();

app.use("*", cors());

console.log('✅ CORS middleware registered');

try {
  app.use(
    "/api/trpc/*",
    trpcServer({
      router: appRouter,
      createContext,
      onError({ error, path }) {
        console.error(`❌ tRPC Error on ${path}:`, error);
      },
    })
  );
  console.log('✅ tRPC server registered at /api/trpc/*');
} catch (error) {
  console.error('❌ Failed to register tRPC server:', error);
  throw error;
}

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.get("/api/health", (c) => {
  return c.json({ 
    status: "ok", 
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.onError((err, c) => {
  console.error('❌ Hono Error:', err);
  return c.json(
    {
      error: {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      },
    },
    500
  );
});

console.log('✅ Backend server configured successfully');

export default app;
