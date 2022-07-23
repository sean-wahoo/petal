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
        comments = await prisma.comments.findMany({
          select: {
            comment_id: true,
            parent_id: true,
            ups: true,
            downs: true,
            is_reply: true,
            content: true,
            author: {
              select: {
                user_id: true,
                display_name: true,
              },
            },
            created_at: true,
            rated_comment: true,
          },
          where: {
            parent_id: parent_id as string,
            is_reply: true,
          },
          take: 12,
        });
        replies = await Promise.all(
          comments.map(async (comment: any) => {
            const replies = await searchCommentsRecursively(
              comment.comment_id,
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
    const first_level_comments = await prisma.comments.findMany({
      select: {
        comment_id: true,
        parent_id: true,
        ups: true,
        downs: true,
        is_reply: true,
        content: true,
        author: {
          select: {
            user_id: true,
            display_name: true,
          },
        },
        created_at: true,
        rated_comment: true,
      },
      where: {
        parent_id: parent_id as string,
        is_reply: false,
      },
      take: 12,
    });
    comments.push(...first_level_comments.sort(compFunc));

    comments = await Promise.all(
      comments.map(async (comment: any) => {
        const replies = await searchCommentsRecursively(comment.comment_id, 2);
        comment.replies = replies;
        return comment;
      })
    );
    console.error({ serverComments: comments });
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
