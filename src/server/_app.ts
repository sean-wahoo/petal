import { createRouter } from "src/server/createRouter";
import post from "src/server/routers/posts";
import users from "src/server/routers/users";
import friends from "src/server/routers/friends";
import comments from "src/server/routers/comments";
import rates from "src/server/routers/rates";
import { TRPCError } from "@trpc/server";
import { getSession } from "next-auth/react";
import { Context } from "./context";
export const appRouter = createRouter()
  .merge("user.", users)
  .merge("post.", post)
  .merge("friend.", friends)
  .merge("comment.", comments)
  .merge("rate.", rates);

export const getUserSession = async ({ req }: Context) => {
  const session = await getSession({ req });
  if (!session) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return session;
};

export type AppRouter = typeof appRouter;
