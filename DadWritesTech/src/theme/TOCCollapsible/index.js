import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import {useCollapsible} from '@docusaurus/theme-common';
import TOCItems from '@theme/TOCItems';
import CollapseButton from '@theme/TOCCollapsible/CollapseButton';
import styles from './styles.module.css';

export default function TOCCollapsible({
  toc,
  className,
  minHeadingLevel,
  maxHeadingLevel,
}) {
  const {collapsed, toggleCollapsed} = useCollapsible({
    initialState: true,
  });

  const contentRef = useRef(null);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    if (collapsed) {
      contentElement.style.height = '0px';
      contentElement.style.overflow = 'hidden';
    } else {
      contentElement.style.height = `${contentElement.scrollHeight}px`;
      contentElement.style.overflow = 'visible';
    }

    // Add transition for height
    contentElement.style.transition = 'height 0.3s ease-in-out';

  }, [collapsed]);

  return (
    <div
      className={clsx(
        styles.tocCollapsible,
        !collapsed && styles.tocCollapsibleExpanded,
        className,
      )}>
      <CollapseButton collapsed={collapsed} onClick={toggleCollapsed} />
      <div
        ref={contentRef}
        className={styles.tocCollapsibleContent} // Keep this class for styling
        style={{ height: collapsed ? '0px' : 'auto', overflow: collapsed ? 'hidden' : 'visible' }} // Initial inline styles
      >
        <TOCItems
          toc={toc}
          minHeadingLevel={minHeadingLevel}
          maxHeadingLevel={maxHeadingLevel}
        />
      </div>
    </div>
  );
}