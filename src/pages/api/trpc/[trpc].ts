import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "src/server/context";
import { appRouter } from "src/server/_app";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error, type, path, input, ctx, req }) {},
  batching: {
    enabled: true,
  },
});
