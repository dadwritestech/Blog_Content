import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  const glitchElementsRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const chaosCardsRef = useRef<NodeListOf<HTMLElement> | null>(null);

  useEffect(() => {
    // Glitch effect on title
    glitchElementsRef.current = document.querySelectorAll('.glitch');
    glitchElementsRef.current.forEach(element => {
      const handleMouseEnter = () => {
        element.style.animation = 'none';
        void element.offsetHeight; // Trigger reflow
        element.style.animation = 'glitch1 0.1s infinite';
      };
      const handleMouseLeave = () => {
        element.style.animation = '';
      };
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    // Random chaos card animations
    chaosCardsRef.current = document.querySelectorAll('.chaos-card');
    chaosCardsRef.current.forEach((card, index) => {
      const handleMouseEnter = () => {
        const randomRotation = (Math.random() - 0.5) * 4;
        card.style.transform = `rotate(${randomRotation}deg) scale(1.05)`;
      };
      const handleMouseLeave = () => {
        const originalRotations = [-1, 1, -0.5]; // These correspond to the CSS initial rotations
        card.style.transform = `rotate(${originalRotations[index]}deg) scale(1)`;
      };
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main>
        <section className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="word-1 glitch" data-text="DAD">DAD</span><br />
                <span className="word-2 glitch" data-text="WRITES">WRITES</span><br />
                <span className="word-3 glitch" data-text="TECH">TECH</span>
              </h1>
              <p className="hero-subtitle">// digital_chaos_organized.exe</p>
              <div className="hero-ascii">
                {'╔══════════════════════════════════╗'}<br />
                {'║  WHERE PARENTING MEETS PIXELS    ║'}<br />
                {'║  AND CODE MEETS COFFEE BREAKS    ║'}<br />
                {'║  TECHNICAL WRITING FOR HUMANS    ║'}<br />
                {'╚══════════════════════════════════╝'}
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-elements">
                <div className="floating-icon">💻</div>
                <div className="floating-icon">🎮</div>
                <div className="floating-icon">🔧</div>
                <div className="floating-icon">☕</div>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Digital Domains</h2>
            <p className="section-subtitle">// exploring_the_intersection_of_tech_and_life</p>
          </div>

          <div className="chaos-grid">
            <div className="chaos-card" style={{ color: 'var(--neon-cyan)' }}>
              <div className="card-header">
                <div className="card-icon">
                  <span>💻</span>
                </div>
                <h3 className="card-title">Tech Guides</h3>
              </div>
              <div className="card-content">
                <p className="card-description">
                  Raw, unfiltered technical documentation for real-world problems.
                  No corporate fluff, just solutions that work when you're debugging at 2 AM.
                </p>
                <div className="card-stats">
                  <span className="stat">PRACTICAL</span>
                  <span className="stat">TESTED</span>
                  <span className="stat">COFFEE-DRIVEN</span>
                </div>
                <Link to="#" className="card-link">ACCESS_GUIDES</Link>
              </div>
            </div>

            <div className="chaos-card" style={{ color: 'var(--neon-pink)' }}>
              <div className="card-header">
                <div className="card-icon">
                  <span>🎮</span>
                </div>
                <h3 className="card-title">Gaming Insights</h3>
              </div>
              <div className="card-content">
                <p className="card-description">
                  Gaming reviews and insights for adults who have responsibilities but still need to save the world.
                  Reviews that respect your time and wallet.
                </p>
                <div className="card-stats">
                  <span className="stat">ADULT-FOCUSED</span>
                  <span className="stat">TIME-CONSCIOUS</span>
                  <span className="stat">HONEST</span>
                </div>
                <Link to="#" className="card-link">LEVEL_UP</Link>
              </div>
            </div>

            <div className="chaos-card" style={{ color: 'var(--neon-green)' }}>
              <div className="card-header">
                <div className="card-icon">
                  <span>🔧</span>
                </div>
                <h3 className="card-title">DIY Projects</h3>
              </div>
              <div className="card-content">
                <p className="card-description">
                  Weekend warrior projects that won't destroy your marriage or budget.
                  Tested by someone who actually has to explain failures to their spouse.
                </p>
                <div className="card-stats">
                  <span className="stat">FAMILY-TESTED</span>
                  <span className="stat">BUDGET-AWARE</span>
                  <span className="stat">REALISTIC</span>
                </div>
                <Link to="#" className="card-link">BUILD_STUFF</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}