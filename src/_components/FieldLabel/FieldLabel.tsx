import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import styles from './FieldLabel.module.scss';

interface FieldErrorProps {
  className?: string;
  isInvalid?: boolean;
  children?: ReactNode;
}

const FieldLabel: FC<FieldErrorProps> = ({ className, isInvalid = false, children }) => {
  return <label className={classNames(styles.label, className, { [styles.invalid]: isInvalid })}>{children}</label>;
};

export default FieldLabel;