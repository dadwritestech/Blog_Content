import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Practical Tech Guides',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (<>Discover straightforward guides on gadgets, software, and smart home tech designed for everyday use.</>),
  },
  {
    title: 'Gaming for Grown-Ups',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (<>Explore casual gaming insights, reviews, and tips for busy parents who still love to play.</>),
  },
  {
    title: 'DIY & How-To\'s',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (<>Learn simple, effective solutions for common tech challenges and personal projects.</>),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
