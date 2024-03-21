import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps {
  className?: string;
  children?: ReactNode;
}

const Card: FC<CardProps> = ({ className, children }) => {
  return (
    <div className={classNames(styles.card, className)}>
      {children}
    </div>
  );
};

export default Card;