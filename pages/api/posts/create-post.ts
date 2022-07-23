import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid/async";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { title, content, author_user_id } = JSON.parse(req.body);
    let post_id = await nanoid(11);
    post_id = `post-${post_id}`;
    const new_post = await prisma.posts.create({
      data: {
        post_id,
        author: {
          connect: {
            user_id: author_user_id,
          },
        },
        title,
        content,
        is_edited: true,
        ups: 0,
        downs: 0,
      },
    });
    return res.status(200).json({ post: new_post });
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
