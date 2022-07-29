import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { parent_id } = req.query;
    const compFunc = (a: any, b: any) =>
      a.ups + a.downs > b.ups + b.downs ? -1 : 1;

    const searchCommentsRecursively = async (parent_id: string, i: number) => {
      let replies: any = [];
      if (i > 0) {
        comments = await prisma.comment.findMany({
          select: {
            commentId: true,
            parentId: true,
            ups: true,
            downs: true,
            isReply: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            createdAt: true,
            ratedComment: true,
          },
          where: {
            parentId: parent_id as string,
            isReply: true,
          },
          take: 12,
        });
        replies = await Promise.all(
          comments.map(async (comment: any) => {
            const replies = await searchCommentsRecursively(
              comment.commentId,
              i - 1
            );
            comment.replies = replies;
            return { ...comment };
          })
        );
      }
      return replies;
    };
    let comments = [];
    const first_level_comments = await prisma.comment.findMany({
      select: {
        commentId: true,
        parentId: true,
        ups: true,
        downs: true,
        isReply: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        ratedComment: true,
      },
      where: {
        parentId: parent_id as string,
        isReply: false,
      },
      take: 12,
    });
    comments.push(...first_level_comments.sort(compFunc));

    comments = await Promise.all(
      comments.map(async (comment: any) => {
        const replies = await searchCommentsRecursively(comment.commentId, 2);
        comment.replies = replies;
        return comment;
      })
    );
    return res.status(200).json([...comments]);
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
