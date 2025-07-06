import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';

export default function Navbar() {
  const logoRef = useRef(null);

  useEffect(() => {
    const logoElement = logoRef.current;
    if (logoElement) {
      // Blinking cursor animation for the logo
      const blinkKeyframes = `
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `;
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(blinkKeyframes, styleSheet.cssRules.length);

      // Apply the animation to the ::after pseudo-element
      // This is a bit tricky to do directly in React style, so we'll rely on the CSS class
    }
  }, []);

  return (
    <header>
      <nav>
        <Link to="/" className="logo" ref={logoRef}>
          dad_writes_tech
        </Link>
        <ul className="nav-menu">
          <li><Link to="/about">[about]</Link></li>
          <li><Link to="/blog">[blog]</Link></li>
          <li><Link to="/projects">[projects]</Link></li>
          <li><Link to="/gaming">[gaming]</Link></li>
          <li><Link to="/tools">[tools]</Link></li>
          <li><Link to="/contact">[contact]</Link></li>
        </ul>
      </nav>
    </header>
  );
}