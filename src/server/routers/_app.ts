import { mergeRouters } from "../trpc";
import { userRouter } from "./_user";
import { bookmarkRouter } from "./_bookmark";
import { folderRouter } from "./_folder";

export const appRouter = mergeRouters(userRouter, bookmarkRouter, folderRouter);

export type AppRouter = typeof appRouter;
