import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { userDb } from "@/backend/db";

export default publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      gender: z.enum(["male", "female"]),
    })
  )
  .mutation(async ({ input }) => {
    try {
      console.log('Signup route: received input', input);
      
      const existingUser = userDb.findByEmail(input.email);
      console.log('Signup route: checked existing user', existingUser);

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const newUser = userDb.create({
        id: Math.random().toString(36).substr(2, 9),
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,
        password: input.password,
      });
      console.log('Signup route: created user', { id: newUser.id, email: newUser.email });

      const token = Buffer.from(`${newUser.id}:${newUser.email}`).toString(
        "base64"
      );

      const response = {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          gender: newUser.gender,
        },
      };
      
      console.log('Signup route: returning response');
      return response;
    } catch (error) {
      console.error('Signup route error:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to create user",
      });
    }
  });
