import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid/async";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { title, content, authorUserId } = JSON.parse(req.body);
    let postId = await nanoid(11);
    postId = `post-${postId}`;
    const new_post = await prisma.post.create({
      data: {
        postId,
        author: {
          connect: {
            id: authorUserId,
          },
        },
        title,
        content,
        isEdited: true,
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
