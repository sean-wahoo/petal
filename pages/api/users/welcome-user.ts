import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id } = req.query;
    await prisma.users.update({
      where: {
        user_id: user_id as string,
      },
      data: {
        been_welcomed: true,
      },
    });
    return res.status(200).json({ message: "success" });
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
