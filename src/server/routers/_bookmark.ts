import { z } from "zod";
import { privateProcedure, router } from "../trpc";

export const bookmarkRouter = router({
  all: privateProcedure
    /*.input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )*/
    .query(async (opts) => {
      try {
        return { id: opts.ctx.user.id };
      } catch (error) {
        throw error;
      }
    }),
});
