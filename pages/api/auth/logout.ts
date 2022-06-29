import type { NextApiRequest, NextApiResponse } from "next";
import { LogoutData } from "lib/types";
import { PrismaClient } from "@prisma/client";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { user_id }: LogoutData = JSON.parse(req.body);

    await prisma.users.update({
      where: { user_id: user_id },
      data: { cache_key: null },
    });
    return res.status(200).json({});
  } catch (e: any) {
    console.error({ e });
    return res
      .status(500)
      .json({ is_error: true, error_code: e.code, error_message: e.message });
  } finally {
    prisma.$disconnect();
  }
}
