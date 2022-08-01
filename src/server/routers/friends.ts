import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";
import { nanoid } from "nanoid/async";
import { TRPCError } from "@trpc/server";
import { getUserSession } from "../_app";

export default createRouter()
  .query("byUserId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return prisma.friend.findMany({
        select: {
          friendId: true,
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          OR: [
            {
              senderUserId: input.id,
            },
            {
              recipientUserId: input.id,
            },
          ],
        },
      });
    },
  })
  .mutation("sendRequest", {
    input: z.object({
      recipientUserId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const session = await getUserSession(ctx);
      const { recipientUserId } = input;
      const currentFriendData = await prisma.friend.findFirst({
        select: {
          status: true,
        },
        where: {
          OR: [
            {
              senderUserId: session?.id as string,
            },
            {
              recipientUserId: session?.id as string,
            },
          ],
        },
      });
      switch (currentFriendData?.status) {
        case "sent":
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Request already sent!",
          });
        case "pending":
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Request is pending!",
          });
        case "accepted":
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You are already friends!",
          });
        default:
          break;
      }
      const friendId = `friend-${await nanoid(11)}`;
      return await prisma.friend.create({
        data: {
          friendId,
          senderUserId: session?.id as string,
          recipientUserId,
          status: "sent",
        },
      });
    },
  })
  .mutation("acceptRequest", {
    input: z.object({
      friendId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const session = await getUserSession(ctx);
      const { friendId } = input;
      const id = getUserSession(ctx);

      const currentFriendData = await prisma.friend.findFirst({
        select: {
          status: true,
        },
        where: {
          friendId,
          OR: [
            { senderUserId: session?.id as string },
            { recipientUserId: session?.id as string },
          ],
        },
      });
      if (!currentFriendData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No friend request!",
        });
      }
      switch (currentFriendData.status) {
        case "accepted":
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You are already friends!",
          });
        default:
          break;
      }
      return await prisma.friend.update({
        where: { friendId },
        data: { status: "accepted" },
        select: {
          friendId: true,
          status: true,
        },
      });
    },
  })
  .mutation("removeFriend", {
    input: z.object({
      friendId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const session = await getUserSession(ctx);
      const { friendId } = input;
      const currentFriendData = await prisma.friend.findFirst({
        select: {
          status: true,
        },
        where: {
          friendId,
          OR: [
            { senderUserId: session?.id as string },
            { recipientUserId: session?.id as string },
          ],
        },
      });
      if (!currentFriendData || currentFriendData?.status === "sent") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not friends!",
        });
      }
      return await prisma.friend.delete({
        where: { friendId },
      });
    },
  });
