import PasswordField from "@/components/PasswordField/PasswordField";
import SendFormButton from "@/components/SendFormButton";
import TextField from "@/components/TextField";
import styles from "./SigninForm.module.scss";
import { useRedirectAuthenticated } from "@/hooks/useRedirect";
import { FormEvent, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import {
  EmailValidator,
  PasswordValidator,
  validate,
} from "@/utils/validators";
import Link from "next/link";
import GoogleSigninButton from "@/components/GoogleSigninButton";

export default function SigninForm() {
  useRedirectAuthenticated("/home");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    const validation = validate(
      { email: EmailValidator, password: PasswordValidator },
      { email: email, password: password }
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
    const res = await signIn("authentication", {
      email,
      password,
      redirect: false,
    });
    if (!res?.ok) setServerError("An error occurred. Please try again.");
  };

  return (
    <form className={styles.container} onSubmit={handleLogin}>
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
      <div className={styles.restore}>
        <Link href="/not-implemented">
          <p>Restore Password</p>
        </Link>
      </div>
      <SendFormButton size="md" variant="contained" color="blue">
        Sign In
      </SendFormButton>
      <div className={styles.horizontalBreak}>
        <div className={styles.line}></div>
        <p className={styles.text}>or</p>
        <div className={styles.line}></div>
      </div>
      <GoogleSigninButton />
      <div>{serverError}</div>
    </form>
  );
}
