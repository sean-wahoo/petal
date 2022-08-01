import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";
import { nanoid } from "nanoid/async";
import { TRPCError } from "@trpc/server";
import { getUserSession } from "../_app";

export default createRouter()
  .query("getAll", {
    async resolve() {
      return await prisma.post.findMany({
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
      const post = await prisma.post.findUnique({
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
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found!",
        });
      }
      return post;
    },
  })
  .mutation("createPost", {
    input: z.object({
      title: z.string(),
      content: z.any(),
    }),
    async resolve({ input, ctx }) {
      const session = await getUserSession(ctx);
      const { title, content } = input;
      const postId = `post-${await nanoid(11)}`;
      return await prisma.post.create({
        data: {
          postId,
          author: {
            connect: {
              id: session?.id as string,
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
