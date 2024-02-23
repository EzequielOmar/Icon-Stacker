import classNames from "classnames";
import styles from "./SignupForm.module.scss";
import TextField from "@/_components/TextField";
import PasswordField from "@/_components/PasswordField";
import SendFormButton from "@/_components/SendFormButton";
import { FormEvent, useRef, useState } from "react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import trpc from "@/utils/trpc";
import { publicUser } from "@/server/db/User";
import { useRedirectAuthenticated } from "@/_middlewares/authMiddleware";

const validationSchema = z
  .object({
    email: z
      .string()
      .email("Email is not valid")
      .min(1, "Email Required")
      .max(255, "Maximum length of email is 255"),
    password: z
      .string()
      .min(1, "Password Required")
      .max(255, "Maximum password length is 255")
      .regex(
        /^(?=.*?[A-Za-z])(?=.*\d)(?=.*[-'/`~!#*$@_%+=.,^&(){}[\]|;:"<>?\\])\S{6,}$/,
        "Password should be a minimum of 6 characters, including a letter, number and special character"
      ),
    passwordRepeat: z.string().min(1, "Repeat Password Required"),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Passwords must match",
    path: ["passwordRepeat"],
  });

export default function SignupForm() {
  useRedirectAuthenticated("/home");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordRepeatRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const signup = trpc.signup.useMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";
    const passwordRepeat = passwordRepeatRef.current?.value ?? "";
    try {
      validationSchema.parse({
        email: email,
        password: password,
        passwordRepeat: passwordRepeat,
      });
      const user: publicUser = await signup.mutateAsync({ email, password });
      //* Automatically signin after user creation
      if (user)
        await signIn("authentication", {
          email: email,
          password: password,
          redirect: false,
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.errors.reduce(
            (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
            {}
          )
        );
      } else {
        setServerError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form className={classNames(styles.form)} onSubmit={handleSubmit}>
      <TextField
        label="E-mail"
        name="email"
        placeholder="E-mail"
        ref={emailRef}
        error={errors.email}
      />
      <PasswordField
        className={styles.field}
        label="Password"
        name="password"
        ref={passwordRef}
        error={errors.password}
      />
      <PasswordField
        className={styles.field}
        label="Repeat Password"
        name="passwordRepeat"
        ref={passwordRepeatRef}
        error={errors.passwordRepeat}
      />
      <div className={styles.controls}>
        <SendFormButton size="md" variant="contained" color="blue">
          Sign In
        </SendFormButton>
      </div>
      <div>{serverError}</div>
      <div>{signup.isPending && "Loading..."}</div>
      <span onClick={() => signIn("google")}>Sign up with Google</span>
    </form>
  );
}
