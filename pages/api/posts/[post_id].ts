import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { post_id } = req.query;
    const post = await prisma.post.findUnique({
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
        ups: true,
        downs: true,
        createdAt: true,
        updatedAt: true,
        ratedPost: true,
      },
      where: {
        postId: post_id as string,
      },
    });
    return res.status(200).json(post);
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
