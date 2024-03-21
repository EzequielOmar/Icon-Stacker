import { useRedirectAuthenticated } from "@/hooks/useRedirect";
import styles from "./SignupForm.module.scss";
import trpc from "@/utils/trpc";
import {
  EmailValidator,
  PasswordValidator,
  RepeatPasswordValidator,
  validateWithRepeatPassword,
} from "@/utils/validators";
import { signIn } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";
import TextField from "@/components/TextField";
import PasswordField from "@/components/PasswordField/PasswordField";
import SendFormButton from "@/components/SendFormButton";
import Link from "next/link";
import GoogleSigninButton from "@/components/GoogleSigninButton";

export default function SignupForm() {
  useRedirectAuthenticated("/home");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const signup = trpc.signup.useMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";
    const repeatPassword = repeatPasswordRef.current?.value ?? "";
    const validation = validateWithRepeatPassword(
      {
        email: EmailValidator,
        password: PasswordValidator,
        repeatPassword: RepeatPasswordValidator,
      },
      { email: email, password: password, repeatPassword: repeatPassword }
    );
    if (!validation.success) {
      setErrors(
        validation.error.errors.reduce(
          (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
          {}
        )
      );
      return;
    }
    try {
      await signup.mutateAsync({ email, password }).then(() =>
        //* Automatically signin after user creation
        signIn("authentication", {
          email: email,
          password: password,
          redirect: false,
        })
      );
    } catch {
      setServerError("An error occurred. Please try again.");
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
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
        ref={repeatPasswordRef}
        error={errors.repeatPassword}
      />
      <div className={styles.controls}>
        <SendFormButton size="md" variant="contained" color="blue">
          Sign Up
        </SendFormButton>
      </div>
      <div>{serverError}</div>
      <div>{signup.isPending && "Loading..."}</div>
      <p className={styles.terms}>
        By clicking 'Sign Up', you agree to the{" "}
        <Link href="/not-implemented"> Terms of Service</Link> &{" "}
        <Link href="/not-implemented"> Privacy Policy</Link>.
      </p>
      <div className={styles.horizontalBreak}>
        <div className={styles.line}></div>
        <p className={styles.text}>or</p>
        <div className={styles.line}></div>
      </div>
      <GoogleSigninButton />
    </form>
  );
}
