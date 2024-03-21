import classNames from "classnames";
import React, { forwardRef, useState } from "react";
import { InputHTMLAttributes } from "react";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import Input from "../Input";
import styles from "./PasswordField.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  name?: string;
  isInvalid?: boolean;
  error?: string;
}

const PasswordField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, label, name, isInvalid, error, type: _, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () =>
      setIsPasswordVisible((prevValue) => !prevValue);

    return (
      <div className={classNames(styles.container, className)}>
        {label && label.length > 0 && (
          <FieldLabel isInvalid={isInvalid}>{label}</FieldLabel>
        )}
        <div className={styles.inputWrapper}>
          <Input
            className={styles.input}
            ref={ref}
            type={isPasswordVisible ? "text" : "password"}
            name={name}
            isInvalid={isInvalid}
            {...props}
          />
          <button
            type="button"
            className={classNames(styles.toggleVisibilityButton, {
              [styles.red]: isInvalid,
            })}
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <FontAwesomeIcon icon={faEye} width={20} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} width={20} />
            )}
          </button>
        </div>
        {error && error.length > 0 && (
          <FieldError>* {error} *</FieldError>
        )}
      </div>
    );
  }
);

export default PasswordField;
