import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function updateProfileImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { user_id, image_url } = req.query;

    const updated_user = await prisma.users.update({
      where: { user_id: user_id as string },
      data: { image_url: image_url as string },
      select: { email: true, user_id: true, image_url: true },
    });

    return res.json({ ...updated_user });
  } catch (e: any) {
    console.log({ e });
    res.status(500).json(e);
  } finally {
    prisma.$disconnect();
  }
}
