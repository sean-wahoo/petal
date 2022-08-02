import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  return ctx;
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
