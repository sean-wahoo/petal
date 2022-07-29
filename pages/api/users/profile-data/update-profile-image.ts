import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function updateProfileImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { id, image } = req.query;

    const updated_user = await prisma.user.update({
      where: { id: id as string },
      data: { image: image as string },
      select: { email: true, id: true, image: true },
    });

    return res.json({ ...updated_user });
  } catch (e: any) {
    console.error({ e });
    res.status(500).json(e);
  } finally {
    prisma.$disconnect();
  }
}
