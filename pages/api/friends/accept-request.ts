import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  try {
    const { friend_id } = req.body;
    const current_friend_data = await prisma.friends.findFirst({
      select: {
        status: true,
      },
      where: {
        friend_id,
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

    const friend_accepted = await prisma.friends.update({
      where: {
        friend_id,
      },
      data: {
        status: "accepted",
      },
      select: {
        friend_id: true,
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
