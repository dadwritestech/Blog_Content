import React, { useState } from 'react';
import Layout from '@theme/Layout';
import AnnualMileageCalculator from '@site/src/components/AnnualMileageCalculator';
import ContractionTimer from '@site/src/components/ContractionTimer';
import TextFormatter from '@site/src/components/TextFormatter';

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
    <Layout title="Tools & Utilities" description="A collection of useful tools and calculators for daily productivity.">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12">
            <header className="text--center margin-bottom--lg">
              <h1>Tools & Utilities</h1>
              <p className="hero--subtitle">
                A collection of practical tools designed to solve everyday problems and boost productivity.
              </p>
            </header>

            {/* Category Filter */}
            <div className="text--center margin-bottom--lg">
              <div className="button-group button-group--block">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`button ${selectedCategory === category ? 'button--primary' : 'button--secondary'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="row">
              {filteredTools.map(tool => (
                <div key={tool.id} className="col col--12 margin-bottom--lg">
                  <div className="card shadow--md">
                    <div className="card__header">
                      <div className="avatar">
                        <div className="avatar__intro">
                          <div className="avatar__name">
                            <span style={{ fontSize: '2rem', marginRight: '1rem' }}>{tool.icon}</span>
                            {tool.title}
                          </div>
                          <small className="avatar__subtitle">
                            <span className="badge badge--secondary">{tool.category}</span>
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="card__body">
                      <p>{tool.description}</p>
                      <div className="margin-bottom--sm">
                        {tool.tags.map(tag => (
                          <span key={tag} className="badge badge--outline margin-right--sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card__footer">
                      <button 
                        className={`button button--block ${selectedTool === tool.id ? 'button--secondary' : 'button--primary'}`}
                        onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                      >
                        {selectedTool === tool.id ? 'Hide Tool' : 'Use Tool'}
                      </button>
                    </div>
                    {selectedTool === tool.id && (
                      <div className="card__footer" style={{ borderTop: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)' }}>
                        <div className="calculator-container">
                          {tool.component}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <section className="margin-top--xl">
              <h2 className="text--center margin-bottom--lg">Why Use These Tools?</h2>
              <div className="row">
                <div className="col col--6 col--md-3 margin-bottom--lg">
                  <div className="text--center">
                    <div style={{ fontSize: '3rem' }}>🚀</div>
                    <h3>Fast & Efficient</h3>
                    <p>Lightweight tools that load instantly and provide immediate results.</p>
                  </div>
                </div>
                <div className="col col--6 col--md-3 margin-bottom--lg">
                  <div className="text--center">
                    <div style={{ fontSize: '3rem' }}>🔒</div>
                    <h3>Privacy Focused</h3>
                    <p>All processing happens locally in your browser. No data sent to servers.</p>
                  </div>
                </div>
                <div className="col col--6 col--md-3 margin-bottom--lg">
                  <div className="text--center">
                    <div style={{ fontSize: '3rem' }}>📱</div>
                    <h3>Mobile Friendly</h3>
                    <p>Responsive design ensures perfect functionality on all devices.</p>
                  </div>
                </div>
                <div className="col col--6 col--md-3 margin-bottom--lg">
                  <div className="text--center">
                    <div style={{ fontSize: '3rem' }}>💡</div>
                    <h3>User Friendly</h3>
                    <p>Intuitive interfaces with no learning curve required.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}
