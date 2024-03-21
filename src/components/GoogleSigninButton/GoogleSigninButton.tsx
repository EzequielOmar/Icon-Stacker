import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import styles from "./GoogleSigninButton.module.scss";
import { signIn } from "next-auth/react";

const GoogleSigninButton = () => {
  return (
    <div className={styles.google} onClick={() => signIn("google")}>
      <p>
        <FontAwesomeIcon icon={faGoogle} width={30} /> Sign in with Google
      </p>
    </div>
  );
};

export default GoogleSigninButton;
