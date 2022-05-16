import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function destroySession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { session_id }: { [k: string]: string } = JSON.parse(req.body);
    await prisma.users.updateMany({
      where: { session_id: session_id },
      data: { session_id: null },
    });
    return res.status(200).json({ message: "yea" });
  } catch (e: any) {
    console.log({ e });
  } finally {
    prisma.$disconnect();
  }
}
