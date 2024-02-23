import classNames from 'classnames';
import React from 'react';
import { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  isInvalid?: boolean;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, isInvalid, error, ...props }, ref) => {
  return (
    <input ref={ref} className={classNames(styles.input, className, { [styles.invalid]: isInvalid })} {...props} />
  );
});

export default Input;