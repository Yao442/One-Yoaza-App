import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import signupRoute from "./routes/auth/signup/route";
import loginRoute from "./routes/auth/login/route";
import getMeRoute from "./routes/auth/getMe/route";

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

export type AppRouter = typeof appRouter;
