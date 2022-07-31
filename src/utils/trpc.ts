import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "src/server/_app";

export const trpc = createReactQueryHooks<AppRouter>();
