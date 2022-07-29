import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id } = req.query;
    const friend_data = await prisma.friend.findMany({
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
            senderUserId: user_id as string,
          },
          {
            recipientUserId: user_id as string,
          },
        ],
      },
    });

    return res.status(200).json(friend_data);
  } catch (e: any) {
    console.error({ e });
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
    });
  } finally {
    prisma.$disconnect();
  }
};
