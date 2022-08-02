import { prisma } from "src/utils/prisma";
import { createRouter } from "src/server/createRouter";
import { z } from "zod";
import { nanoid } from "nanoid/async";
import { getUserSession } from "../_app";

export default createRouter()
  .query("getByParentId", {
    input: z.object({
      parentId: z.string(),
    }),
    async resolve({ input }) {
      const parentId = input.parentId;
      let comments = [];

      const compFunc = (a: any, b: any) =>
        a.ups + a.downs > b.ups + b.downs ? -1 : 1;
      const searchCommentsRecursively = async (
        parent_id: string,
        i: number
      ) => {
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
          parentId: parentId as string,
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
      return comments;
    },
  })
  .mutation("leaveComment", {
    input: z.object({
      content: z.any().refine((val) => !!val),
      parentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const session = await getUserSession(ctx);
      const { content, parentId } = input;
      const isReply = parentId.split("-")[0] === "comment";
      const commentId = `comment-${await nanoid(11)}`;
      return await prisma.comment.create({
        data: {
          commentId,
          author: {
            connect: {
              id: session?.id as string,
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
    },
  });
