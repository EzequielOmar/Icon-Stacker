import { FormEvent, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./LoginForm.module.scss";
import TextField from "@/_components/TextField";
import PasswordField from "@/_components/PasswordField";
import SendFormButton from "@/_components/SendFormButton";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRedirectAuthenticated } from "@/_middlewares/authMiddleware";

const validationSchema = z.object({
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
});

export default function LoginForm() {
  useRedirectAuthenticated("/home");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      validationSchema.parse({
        email: email,
        password: password,
      });
      const res = await signIn("authentication", {
        email,
        password,
        redirect: false,
      });
      if (!res?.ok) {
        throw new Error();
      }
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
    <form className={classNames(styles.form)} onSubmit={handleLogin}>
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
      <div className={styles.controls}>
        <SendFormButton size="md" variant="contained" color="blue">
          Sign In
        </SendFormButton>
        <span onClick={() => signIn("google")}>Sign in with Google</span>
      </div>
      <div>{serverError}</div>
    </form>
  );
}
