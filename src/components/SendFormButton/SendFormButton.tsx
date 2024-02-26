import classNames from 'classnames';
import { useFormStatus } from "react-dom";
import { ButtonHTMLAttributes, FC, ReactElement, ReactNode } from 'react';
import styles from './SendFormButton.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: 'sm' | 'md';
  variant: 'contained' | 'outlined' | 'flat';
  color: 'blue';
  className?: string;
  icon?: ReactElement;
  children: ReactNode;

  onClick?: () => void;
}

const SendFormButton: FC<ButtonProps> = ({ className, size, color = '', variant, icon, children, onClick, ...props }) => {
  //const status = useFormStatus();

  return (
    <button type="submit"
      {...props}
      className={classNames(styles.button, className, styles[size], styles[variant], styles[color])}
      onClick={onClick}
      disabled={/*status.pending*/false}
    >
      <span className={styles.iconWrapper}>{icon}</span>
      {children}
    </button>
  );
};

export default SendFormButton;