import PasswordField from "@/components/PasswordField";
import SendFormButton from "@/components/SendFormButton";
import TextField from "@/components/TextField";
import classNames from "classnames";
import styles from "./SigninForm.module.scss";
import { useRedirectAuthenticated } from "@/hooks/useRedirect";
import { FormEvent, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import {
  EmailValidator,
  PasswordValidator,
  validate,
} from "@/utils/validators";

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
