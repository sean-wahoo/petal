import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";
import * as trpc from "@trpc/server";

export default createRouter()
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          email: true,
          updatedAt: true,
          createdAt: true,
          image: true,
          name: true,
          dateOfBirth: true,
          description: true,
          sender: true,
          recipient: true,
        },
        where: { id: input.id },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found!",
        });
      }
      return user;
    },
  })
  .mutation("updateProfileImage", {
    input: z.object({
      id: z.string(),
      image: z.string().url(),
    }),
    async resolve({ input }) {
      const { id, image } = input;
      const user = await prisma.user.update({
        where: { id },
        data: { image },
        select: { id: true, image: true, email: true },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found!",
        });
      }
      return user;
    },
  })
  .mutation("welcomeUser", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const user = await prisma.user.update({
        where: { id },
        data: { beenWelcomed: true },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found!",
        });
      }
      return user;
    },
  });
