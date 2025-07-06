import React from 'react';
import clsx from 'clsx';
import {blogPostContainerID} from '@docusaurus/utils-common';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import MDXContent from '@theme/MDXContent';
import cardStyles from '../Container/styles.module.css'; // Styles from the card

export default function BlogPostItemContent({children, className}) {
  const {isBlogPostPage} = useBlogPost();
  return (
    <div
      // This ID is used for the feed generation to locate the main content
      id={isBlogPostPage ? blogPostContainerID : undefined}
      className={clsx(
        cardStyles.cardContent, // Apply cardContent style to the wrapper
        'markdown', // Keep Docusaurus's markdown class
        cardStyles.cardDescription, // Apply cardDescription style for text
        className
      )}
    >
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
