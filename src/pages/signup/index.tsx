import SignupForm from "@/components/Forms/signup/SignupForm";
import React from "react";
import styles from "./Signup.module.scss";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";

export default function Signup() {
  return (
    <div className={styles.main}>
      <Card>
        <Link href="/">
          <Image priority src="/logo.svg" alt="logo" width={60} height={80} />
        </Link>
        <h2>Start saving bookmarks!</h2>
        <SignupForm />
        <div className={styles.redirect}>
          <p>Already have an account?</p>
          <Link href="/signin">Sign In!</Link>
        </div>
      </Card>
    </div>
  );
}
