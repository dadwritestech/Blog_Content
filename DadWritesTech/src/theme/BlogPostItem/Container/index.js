import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css'; // Import the CSS module

export default function BlogPostItemContainer({children, className}) {
  return (
    <article className={clsx(className, styles.chaosCard)}>
      {children}
    </article>
  );
}
