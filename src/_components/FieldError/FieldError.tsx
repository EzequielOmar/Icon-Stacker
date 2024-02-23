import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import styles from './FieldError.module.scss';

interface FieldErrorProps {
  className?: string;
  children?: ReactNode;
}

const FieldError: FC<FieldErrorProps> = ({ className, children }) => {
  return (
    <div className={classNames(styles.error, className)}>
      {children}
    </div>
  );
};

export default FieldError;