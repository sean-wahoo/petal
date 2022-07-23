import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid/async";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  try {
    const { sender_user_id, recipient_user_id } = JSON.parse(req.body);
    const current_friend_data = await prisma.friends.findFirst({
      select: {
        status: true,
      },
      where: {
        OR: [
          {
            sender_user_id,
          },
          {
            recipient_user_id,
          },
        ],
      },
    });
    switch (current_friend_data?.status) {
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
    const friend_id = `friend-${await nanoid(11)}`;
    const friend = await prisma.friends.create({
      data: {
        friend_id,
        sender_user_id,
        recipient_user_id,
        status: "sent",
      },
    });
    return res.json({ friend });
  } catch (e: any) {
    console.error({ e });
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
      type: e.type,
    });
  } finally {
    prisma.$disconnect();
  }
};
