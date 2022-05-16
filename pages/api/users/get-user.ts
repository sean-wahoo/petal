import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id } = req.query;
    const user_data = await prisma.users.findFirst({
      select: {
        user_id: true,
        been_welcomed: true,
        email: true,
        image_url: true,
        display_name: true,
      },
      where: {
        user_id: user_id as string,
      },
    });
    console.log({ user_data });
    return res.status(200).json({ ...user_data });
  } catch (e: any) {
    console.log({ e });
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
    });
  } finally {
    prisma.$disconnect();
  }
};
