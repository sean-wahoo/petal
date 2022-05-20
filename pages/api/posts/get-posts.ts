import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getPosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    console.log("hello");
    const posts = await prisma.posts.findMany({
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
      },
    });
    return res.status(200).json([...posts]);
  } catch (e: any) {
    console.log({ e });
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
