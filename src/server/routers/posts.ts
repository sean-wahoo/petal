import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";
import { nanoid } from "nanoid/async";

export default createRouter()
  .query("getAll", {
    async resolve() {
      return prisma.post.findMany({
        select: {
          postId: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          title: true,
          content: true,
          ups: true,
          downs: true,
          createdAt: true,
          updatedAt: true,
          ratedPost: {
            select: {
              rateKind: true,
              userRateId: true,
            },
          },
        },
      });
    },
  })
  .query("byId", {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.post.findUnique({
        select: {
          postId: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          title: true,
          content: true,
          ups: true,
          downs: true,
          createdAt: true,
          updatedAt: true,
          ratedPost: true,
        },
        where: {
          postId: input.postId,
        },
      });
    },
  })
  .mutation("createPost", {
    input: z.object({
      title: z.string(),
      content: z.any(),
      authorUserId: z.string(),
    }),
    async resolve({ input }) {
      const { title, content, authorUserId } = input;
      const postId = `post-${await nanoid(11)}`;
      return await prisma.post.create({
        data: {
          postId,
          author: {
            connect: {
              id: authorUserId,
            },
          },
          title,
          content,
          isEdited: false,
          ups: 0,
          downs: 0,
        },
      });
    },
  });
