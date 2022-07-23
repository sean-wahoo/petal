import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  try {
    const { friend_id } = JSON.parse(req.body);
    const current_friend_data = await prisma.friends.findFirst({
      select: {
        status: true,
      },
      where: {
        friend_id,
      },
    });
    if (!current_friend_data || current_friend_data?.status === "sent") {
      throw { code: "not-friends", message: "Not Friends!" };
    }

    const friend_accepted = await prisma.friends.delete({
      where: {
        friend_id,
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
