import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";

export default createRouter()
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return prisma.user.findFirst({
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
    },
  })
  .mutation("updateProfileImage", {
    input: z.object({
      id: z.string(),
      image: z.string().url(),
    }),
    async resolve({ input }) {
      const { id, image } = input;
      return await prisma.user.update({
        where: { id },
        data: { image },
        select: { id: true, image: true, email: true },
      });
    },
  })
  .mutation("welcomeUser", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      return await prisma.user.update({
        where: { id },
        data: { beenWelcomed: true },
      });
    },
  });
