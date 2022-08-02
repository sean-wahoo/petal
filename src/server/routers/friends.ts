import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";
import { nanoid } from "nanoid/async";

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
      senderUserId: z.string(),
      recipientUserId: z.string(),
    }),
    async resolve({ input }) {
      const { senderUserId, recipientUserId } = input;
      const currentFriendData = await prisma.friend.findFirst({
        select: {
          status: true,
        },
        where: {
          OR: [
            {
              senderUserId,
            },
            {
              recipientUserId,
            },
          ],
        },
      });
      switch (currentFriendData?.status) {
        case "sent":
          throw {
            code: "request-already-sent",
            message: "Request already sent!",
          };
        case "pending":
          throw { code: "request-pending", message: "Request pending!" };
        case "accepted":
          throw { code: "already-friends", message: "Already friends!" };
        default:
          break;
      }
      const friendId = `friend-${await nanoid(11)}`;
      return await prisma.friend.create({
        data: {
          friendId,
          senderUserId,
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
    async resolve({ input }) {
      const { friendId } = input;
      const currentFriendData = await prisma.friend.findFirst({
        select: {
          status: true,
        },
        where: {
          friendId,
        },
      });
      if (!currentFriendData) {
        throw { code: "no-friend-request", message: "No friend request!" };
      }
      switch (currentFriendData.status) {
        case "accepted":
          throw { code: "already-friends", message: "Already friends!" };
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
    async resolve({ input }) {
      const { friendId } = input;
      const currentFriendData = await prisma.friend.findFirst({
        select: {
          status: true,
        },
        where: {
          friendId,
        },
      });
      if (!currentFriendData || currentFriendData?.status === "sent") {
        throw { code: "not-friends", message: "Not Friends!" };
      }
      return await prisma.friend.delete({
        where: { friendId },
      });
    },
  });
