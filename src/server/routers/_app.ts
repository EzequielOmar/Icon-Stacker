import { mergeRouters } from "../trpc";
import { userRouter } from "./_user";
import { bookmarkRouter } from "./_bookmark";

export const appRouter = mergeRouters(userRouter, bookmarkRouter);

export type AppRouter = typeof appRouter;
