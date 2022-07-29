import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getPosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const posts = await prisma.post.findMany({
      select: {
        postId: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        ratedPost: {
          select: {
            rateKind: true,
            userRateId: true,
          },
        },
      },
    });
    console.log({ posts });
    return res.status(200).json([...posts]);
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
}
