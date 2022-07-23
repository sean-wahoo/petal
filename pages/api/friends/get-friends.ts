import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id } = req.query;
    const friend_data = await prisma.friends.findMany({
      select: {
        friend_id: true,
        sender: {
          select: {
            user_id: true,
            display_name: true,
            image_url: true,
          },
        },
        recipient: {
          select: {
            user_id: true,
            display_name: true,
            image_url: true,
          },
        },
        status: true,
        created_at: true,
        updated_at: true,
      },
      where: {
        OR: [
          {
            sender_user_id: user_id as string,
          },
          {
            recipient_user_id: user_id as string,
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
