import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid/async";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function leaveComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { content, authorUserId, parentId } = JSON.parse(req.body);
    const isReply = parentId.split("-")[0] === "comment";
    const commentId = `comment-${await nanoid(11)}`;
    const new_comment = await prisma.comment.create({
      data: {
        commentId,
        author: {
          connect: {
            id: authorUserId,
          },
        },
        parentId,
        content,
        isEdited: false,
        ups: 0,
        downs: 0,
        isReply,
      },
    });
    return res.status(200).json({ commment: new_comment });
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
