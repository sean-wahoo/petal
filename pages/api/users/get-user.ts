import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const user_data = await prisma.user.findFirst({
      select: {
        id: true,
        beenWelcomed: true,
        email: true,
        image: true,
        name: true,
      },
      where: {
        id: id as string,
      },
    });
    return res.status(200).json({ ...user_data });
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
