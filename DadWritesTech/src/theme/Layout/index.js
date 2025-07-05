import React, { useEffect } from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import {
  ThemeClassNames,
} from '@docusaurus/theme-common/internal';
import Head from '@docusaurus/Head';
import LayoutProvider from '@theme/Layout/Provider';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';

import styles from './styles.module.css';

export default function Layout(props) {
  const {children, noFooter, wrapperClassName, title, description} = props;
  const {navbar: {hideOnScroll}, colorMode: {disableSwitch: disableColorModeSwitch}} = useThemeConfig();

  return (
    <LayoutProvider>
      <Head
        title={title}
        description={description}
      />

      <div className="grid-bg"></div>
      <div className="scroll-indicator">
        <div className="scroll-progress"></div>
      </div>

      <BrowserOnly>
        {() => {
          useEffect(() => {
            // Scroll progress indicator
            const handleScroll = () => {
              const scrollProgress = document.querySelector('.scroll-progress');
              if (scrollProgress) {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                scrollProgress.style.width = scrollPercent + '%';
              }
            };

            window.addEventListener('scroll', handleScroll);
            // Initial call to set the scroll progress on load
            handleScroll();

            return () => {
              window.removeEventListener('scroll', handleScroll);
            };
          }, []);

          return null; // Render nothing from BrowserOnly, elements are already in JSX
        }}
      </BrowserOnly>

      {/* Custom SkipToContent implementation */}
      <a href="#main-content" className="skipToContent_fXgn">Skip to main content</a>

      <Navbar />

      <main
        id="main-content" // Added ID for skip to content link
        className={clsx(
          ThemeClassNames.wrapper.main,
          styles.mainWrapper,
          wrapperClassName,
        )}
        style={{ paddingTop: 'var(--ifm-navbar-height)' }} // Add padding to account for fixed header
      >
        {/* Replaced MainProvider with React.Fragment */}
        {children}
      </main>

      {!noFooter && <Footer />}
    </LayoutProvider>
  );
}