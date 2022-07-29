import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user_ids = await prisma.user.findMany({
      select: {
        id: true,
      },
    });
    return res.status(200).json(user_ids);
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
