import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { post_id } = req.query;
    const post = await prisma.posts.findUnique({
      select: {
        post_id: true,
        author: {
          select: {
            user_id: true,
            display_name: true,
          },
        },
        title: true,
        content: true,
        ups: true,
        downs: true,
        created_at: true,
        updated_at: true,
        rated_post: true,
      },
      where: {
        post_id: post_id as string,
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
