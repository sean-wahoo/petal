import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid/async";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function leaveComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { content, author_user_id, parent_id } = req.body;
    const is_reply = parent_id.split("-")[0] === "comment";
    const comment_id = `comment-${await nanoid(11)}`;
    const new_comment = await prisma.comments.create({
      data: {
        comment_id,
        author: {
          connect: {
            user_id: author_user_id,
          },
        },
        parent_id,
        content,
        is_edited: false,
        ups: 0,
        downs: 0,
        is_reply,
      },
    });
    return res.status(200).json({ commment: new_comment });
  } catch (e: any) {
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
