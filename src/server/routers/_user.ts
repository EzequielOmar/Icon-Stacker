import { publicProcedure, router } from "../trpc";
import User, { publicUser } from "../db/User";
import { EmailValidator, PasswordValidator, object } from "@/utils/validators";

export const userRouter = router({
  signup: publicProcedure
    .input(object({ email: EmailValidator, password: PasswordValidator }))
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
