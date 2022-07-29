import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  try {
    const { friendId } = JSON.parse(req.body);
    const current_friend_data = await prisma.friend.findFirst({
      select: {
        status: true,
      },
      where: {
        friendId,
      },
    });
    if (!current_friend_data) {
      throw { code: "no-friend-request", message: "No friend request!" };
    }
    switch (current_friend_data.status) {
      case "accepted":
        throw { code: "already-friends", message: "Already friends!" };
      default:
        break;
    }

    const friend_accepted = await prisma.friend.update({
      where: {
        friendId,
      },
      data: {
        status: "accepted",
      },
      select: {
        friendId: true,
        status: true,
      },
    });
    return res.json({ friend_accepted });
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
