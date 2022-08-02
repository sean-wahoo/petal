import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";
import { revalidate } from "src/utils/helpers";
import { TRPCError } from "@trpc/server";

export default createRouter()
  .mutation("commentRate", {
    input: z.object({
      rateKind: z.string(),
      userRateId: z.string(),
      commentRateId: z.string(),
      removeRate: z.boolean(),
    }),
    async resolve({ input }) {
      const { rateKind, userRateId, commentRateId, removeRate } = input;
      if (removeRate) {
        return await prisma.commentRate.delete({
          where: {
            userRateId_commentRateId: {
              userRateId,
              commentRateId,
            },
          },
        });
      }
      const commentRate = await prisma.commentRate.upsert({
        create: {
          rateKind,
          userRateId,
          commentRateId,
        },
        update: {
          rateKind,
        },
        where: {
          userRateId_commentRateId: {
            userRateId,
            commentRateId,
          },
        },
      });
      if (!commentRate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment rate not found!",
        });
      }
      return commentRate;
    },
  })
  .mutation("postRate", {
    input: z.object({
      rateKind: z.string(),
      userRateId: z.string(),
      postRateId: z.string(),
      removeRate: z.boolean(),
    }),
    async resolve({ input }) {
      const { rateKind, userRateId, postRateId, removeRate } = input;
      if (removeRate) {
        return await prisma.postRate.delete({
          where: {
            userRateId_postRateId: {
              userRateId,
              postRateId,
            },
          },
        });
      }
      const postRate = await prisma.postRate.upsert({
        create: {
          rateKind,
          userRateId,
          postRateId,
        },
        update: {
          rateKind,
        },
        where: {
          userRateId_postRateId: {
            userRateId,
            postRateId,
          },
        },
      });
      if (!postRate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post rate not found!",
        });
      }
      await revalidate(`/posts/${postRateId}`);
      return postRate;
    },
  });
