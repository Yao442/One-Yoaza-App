import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { userDb } from "@/backend/db";

export default publicProcedure
  .input(
    z.object({
      token: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const decoded = Buffer.from(input.token, "base64").toString("utf-8");
      const [userId] = decoded.split(":");

      const user = userDb.findById(userId);

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
      };
    } catch {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid token",
      });
    }
  });
