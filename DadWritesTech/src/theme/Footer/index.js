import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import './styles.css'; // Import the new CSS file

function Footer() {
  useEffect(() => {
    // Terminal typing effect
    const terminalLines = document.querySelectorAll('.terminal-line');
    terminalLines.forEach((line, index) => {
      line.style.opacity = '0';
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transition = 'opacity 0.5s ease';
      }, index * 300);
    });
  }, []);

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-terminal">
          <div className="terminal-line">dad@tech:~$ <span>whoami</span></div>
          <div className="terminal-line">Technical writer, parent, caffeine addict</div>
          <div className="terminal-line">dad@tech:~$ <span>pwd</span></div>
          <div className="terminal-line">/home/dad/writes/tech</div>
          <div className="terminal-line">dad@tech:~$ <span>echo "thanks for reading"</span></div>
          <div className="terminal-line">thanks for reading</div>
        </div>
        <div className="footer-links">
          <Link to="#">[rss]</Link>
          <Link to="https://github.com/your-github" target="_blank" rel="noopener noreferrer">[github]</Link>
          <Link to="https://twitter.com/your-twitter" target="_blank" rel="noopener noreferrer">[twitter]</Link>
          <Link to="mailto:your-email@example.com">[email]</Link>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);