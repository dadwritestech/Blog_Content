import React from 'react';
import clsx from 'clsx';
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';
import cardStyles from '../Container/styles.module.css'; // Styles from the card

export default function BlogPostItemHeader() {
  return (
    <header className={clsx(cardStyles.cardHeader)}>
      <div className={cardStyles.cardIcon}>
        <span>■</span> {/* Placeholder Icon */}
      </div>
      {/* Wrap Title and Info in a div to allow them to stack if needed, or for better flex control */}
      <div style={{ flexGrow: 1 }}>
        <BlogPostItemHeaderTitle />
        <BlogPostItemHeaderInfo />
        <BlogPostItemHeaderAuthors />
      </div>
    </header>
  );
}
