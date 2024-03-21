import SigninForm from "@/components/Forms/signin/SigninForm";
import styles from "./Signin.module.scss";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";

export default function Signin() {
  return (
    <div className={styles.main}>
      <Card>
        <Link href="/">
          <Image priority src="/logo.svg" alt="logo" width={60} height={80} />
        </Link>
        <h2>Welcome back!</h2>
        <SigninForm />
        <div className={styles.redirect}>
          <p>You don't have an account yet?</p>
          <Link href="/signup">Sign Up!</Link>
        </div>
      </Card>
    </div>
  );
}
