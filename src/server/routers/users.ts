import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";
import * as trpc from "@trpc/server";
import { getUserSession } from "../_app";

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
      image: z.string().url(),
    }),
    async resolve({ input, ctx }) {
      const { image } = input;
      const session = await getUserSession(ctx);
      const user = await prisma.user.update({
        where: { id: session?.id as string },
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
  .query("welcomeUser", {
    async resolve({ ctx }) {
      const session = await getUserSession(ctx);
      const user = await prisma.user.update({
        where: { id: session?.id as string },
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
