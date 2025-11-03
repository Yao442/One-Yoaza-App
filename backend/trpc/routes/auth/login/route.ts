import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { userDb } from "@/backend/db";

export default publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const user = userDb.findByEmail(input.email);

    if (!user || user.password !== input.password) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const token = Buffer.from(`${user.id}:${user.email}`).toString("base64");

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
      },
    };
  });
