import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { userDb } from "@/backend/db";
import crypto from "crypto";

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
      console.log('[Signup] Received request for email:', input.email);
      
      let existingUser;
      try {
        existingUser = userDb.findByEmail(input.email);
        console.log('[Signup] Existing user check:', existingUser ? 'Found' : 'Not found');
      } catch (dbError) {
        console.error('[Signup] Database error during user lookup:', dbError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error while checking existing user",
        });
      }

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const userId = crypto.randomUUID();
      console.log('[Signup] Creating new user with ID:', userId);

      let newUser;
      try {
        newUser = userDb.create({
          id: userId,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          password: input.password,
        });
        console.log('[Signup] User created successfully:', newUser.id);
      } catch (dbError) {
        console.error('[Signup] Database error during user creation:', dbError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user in database",
        });
      }

      const token = Buffer.from(`${newUser.id}:${newUser.email}`).toString("base64");

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
      
      console.log('[Signup] Returning success response');
      return response;
    } catch (error) {
      console.error('[Signup] Error:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to create user",
      });
    }
  });
