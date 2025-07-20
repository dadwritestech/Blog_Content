import React, { useState, useRef } from 'react';
import '../css/TextFormatter.css';

// Comprehensive Unicode character maps for various styles
const unicodeMaps = {
  bold: {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  },
  italic: {
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
    '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
  },
  boldItalic: {
    'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
    'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  },
  script: {
    'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
    'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
    '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
  },
  doublestruck: {
    'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
    'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
    '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
  }
};

const TextFormatter = () => {
  const [text, setText] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const mainEditorRef = useRef(null);

  const convertText = (inputText, style) => {
    if (style === 'strikethrough') {
      return inputText.split('').map(char => char + '\u0336').join('');
    }
    if (style === 'underline') {
      return inputText.split('').map(char => char + '\u0332').join('');
    }
    const map = unicodeMaps[style];
    if (!map) return inputText;
    return inputText.split('').map(char => map[char] || char).join('');
  };
  
  const handleStyleButtonClick = (style) => {
    const textarea = mainEditorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (!selectedText) {
        alert("Please select the text you want to style.");
        return;
    }
    
    const styledText = convertText(selectedText, style);
    
    const newText = text.substring(0, start) + styledText + text.substring(end);
    setText(newText);

    textarea.focus();
    setTimeout(() => textarea.setSelectionRange(start, start + styledText.length), 0);
  };

  const handleCopy = (key, content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const outputStyles = [
    { key: 'bold', title: 'Bold' },
    { key: 'italic', title: 'Italic' },
    { key: 'boldItalic', title: 'Bold Italic' },
    { key: 'script', title: 'Script' },
    { key: 'doublestruck', title: 'Doublestruck' },
    { key: 'strikethrough', title: 'Strikethrough' },
    { key: 'underline', title: 'Underline' },
  ];

  return (
    <div className="app-container">
      <header>
        <h1>LinkedIn Text Formatter</h1>
        <p>Create stylized text for posts, comments, and profiles.</p>
      </header>
      
      <main className="main-layout">
        <div className="editor-preview-section">
          <div className="card">
            <h2>Main Editor</h2>
            <p>Select text below and apply a style. You can mix and match.</p>
            <div className="toolbar">
              <button onClick={() => handleStyleButtonClick('bold')}>Bold</button>
              <button onClick={() => handleStyleButtonClick('italic')}>Italic</button>
              <button onClick={() => handleStyleButtonClick('strikethrough')}>Strikethrough</button>
              <button onClick={() => handleStyleButtonClick('underline')}>Underline</button>
            </div>
            <textarea
              ref={mainEditorRef}
              className="main-editor-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
            />
          </div>

          <div className="card">
            <h2>Live Post Preview</h2>
            <div className="linkedin-post-preview">
              <div className="post-header">
                <div className="avatar"></div>
                <div className="user-info">
                  <div className="user-name">Your Name</div>
                  <div className="post-meta">Promoted</div>
                </div>
              </div>
              <div className="post-content">
                {text.split('\n').map((line, index) => (
                  <p key={index}>{line || ' '}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="formatted-outputs-section">
          <div className="card">
            <h2>Formatted Text Outputs</h2>
            <p>Copy the entire text in your desired style.</p>
            <div className="outputs-grid">
              {outputStyles.map(({ key, title }) => {
                const formattedText = convertText(text, key);
                return (
                  <div className="output-box" key={key}>
                    <h3>{title}</h3>
                    <textarea
                      readOnly
                      value={formattedText}
                      className="output-textarea"
                    />
                    <button onClick={() => handleCopy(key, formattedText)}>
                      {copiedKey === key ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>Built with React, HTML, and CSS. Converts standard text to Unicode characters.</p>
      </footer>
    </div>
  );
};

export default TextFormatter;