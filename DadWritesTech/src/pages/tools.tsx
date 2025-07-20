import React, { useState } from 'react';
import Layout from '@theme/Layout';
import AnnualMileageCalculator from '@site/src/components/AnnualMileageCalculator';
import ContractionTimer from '@site/src/components/ContractionTimer';
import TextFormatter from '@site/src/components/TextFormatter';
import '../css/tools-page.css';

const tools = [
  {
    id: 'mileage-calculator',
    title: 'Annual Mileage Calculator',
    description: 'Calculate your yearly vehicle mileage for tax deductions, business expenses, or personal tracking.',
    category: 'Finance',
    icon: '🚗',
    component: <AnnualMileageCalculator />,
    tags: ['Calculator', 'Finance', 'Tax']
  },
  {
    id: 'contraction-timer',
    title: 'Contraction Timer',
    description: 'Track labor contractions with precise timing and frequency analysis for expectant parents.',
    category: 'Health',
    icon: '⏱️',
    component: <ContractionTimer />,
    tags: ['Timer', 'Health', 'Pregnancy']
  },
  {
    id: 'text-formatter',
    title: 'LinkedIn Text Formatter',
    description: 'Convert plain text to stylized Unicode characters for social media posts and professional profiles.',
    category: 'Productivity',
    icon: '✨',
    component: <TextFormatter />,
    tags: ['Text', 'Social Media', 'Unicode']
  }
];

const categories = ['All', ...new Set(tools.map(tool => tool.category))];

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState(null);

  const filteredTools = selectedCategory === 'All' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  return (
    <Layout title="Professional Tools & Utilities" description="A collection of professional tools and calculators for daily productivity.">
      <div className="tools-page">
        {/* Hero Section */}
        <section className="tools-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Professional Tools & Utilities</h1>
              <p className="hero-subtitle">
                A curated collection of practical tools designed to solve everyday problems and boost productivity.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">{tools.length}</span>
                  <span className="stat-label">Tools Available</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{categories.length - 1}</span>
                  <span className="stat-label">Categories</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Free to Use</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="tools-filter">
          <div className="container">
            <div className="filter-tabs">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-tab ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="tools-grid-section">
          <div className="container">
            <div className="tools-grid">
              {filteredTools.map(tool => (
                <div key={tool.id} className="tool-card">
                  <div className="tool-header">
                    <div className="tool-icon">{tool.icon}</div>
                    <div className="tool-meta">
                      <span className="tool-category">{tool.category}</span>
                    </div>
                  </div>
                  <div className="tool-content">
                    <h3 className="tool-title">{tool.title}</h3>
                    <p className="tool-description">{tool.description}</p>
                    <div className="tool-tags">
                      {tool.tags.map(tag => (
                        <span key={tag} className="tool-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="tool-actions">
                    <button 
                      className="tool-button"
                      onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                    >
                      {selectedTool === tool.id ? 'Hide Tool' : 'Use Tool'}
                    </button>
                  </div>
                  {selectedTool === tool.id && (
                    <div className="tool-component">
                      {tool.component}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="tools-features">
          <div className="container">
            <h2 className="features-title">Why Use These Tools?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Fast & Efficient</h3>
                <p>Lightweight tools that load instantly and provide immediate results without unnecessary complexity.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Privacy Focused</h3>
                <p>All calculations and processing happen locally in your browser. No data is sent to external servers.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Mobile Friendly</h3>
                <p>Responsive design ensures all tools work perfectly on desktop, tablet, and mobile devices.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h3>User Friendly</h3>
                <p>Intuitive interfaces designed with user experience in mind. No learning curve required.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
