import classNames from 'classnames';
import React from 'react';
import styles from './TextField.module.scss';
import { InputHTMLAttributes } from 'react';
import FieldLabel from '../FieldLabel';
import Input from '../Input';
import FieldError from '../FieldError';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  isInvalid?: boolean;
  error?: string;
  name?: string;
  placeholder?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(({ className, label, isInvalid, error, name, placeholder, ...props }, ref) => {
  return (
    <div className={classNames(styles.container, className)}>
      {label && label.length > 0 && <FieldLabel isInvalid={isInvalid}>{label}</FieldLabel>}
      <Input ref={ref} className={styles.input} isInvalid={isInvalid} {...props} name={name} placeholder={placeholder} />
      {error && error.length > 0 && <FieldError>{error}</FieldError>}
    </div>
  );
});

export default TextField;