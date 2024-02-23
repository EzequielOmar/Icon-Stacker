import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import User, { publicUser } from "../db/User";

export const userRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async (opts) => {
      const { email, password } = opts.input;
      try {
        const user: publicUser = await User.createUser(email, password);
        return user;
      } catch (error) {
        throw error;
      }
    }),
});
