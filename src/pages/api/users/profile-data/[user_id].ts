import { PrismaClient } from "@prisma/client";
import { ProfileDataResponse } from "lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const profile_data = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        updatedAt: true,
        createdAt: true,
        image: true,
        name: true,
        dateOfBirth: true,
        description: true,
        sender: true,
        recipient: true,
      },
      where: { id: id as string },
    });
    if (profile_data === null) {
      throw { message: "user-not-found" };
    }
    res.status(200).json({ ...profile_data });
  } catch (e: any) {
    console.error({ e });
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
    } as ProfileDataResponse);
  } finally {
    prisma.$disconnect();
  }
};
