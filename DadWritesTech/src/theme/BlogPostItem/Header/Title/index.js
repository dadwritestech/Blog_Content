import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css'; // Original Docusaurus styles for the title
import cardStyles from '../../Container/styles.module.css'; // Styles from the card

export default function BlogPostItemHeaderTitle({className}) {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {permalink, title} = metadata;
  const TitleHeading = isBlogPostPage ? 'h1' : 'h2';
  return (
    <TitleHeading
      className={clsx(
        styles.title, // Keep original Docusaurus class for base styling if any
        cardStyles.cardTitle, // Add our card title style
        className
      )}
    >
      {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
    </TitleHeading>
  );
}
