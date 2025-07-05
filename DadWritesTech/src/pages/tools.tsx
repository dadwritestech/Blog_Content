import React from 'react';
import Layout from '@theme/Layout';
import AnnualMileageCalculator from '@site/src/components/AnnualMileageCalculator';
import ContractionTimer from '@site/src/components/ContractionTimer';

export default function Tools() {
  return (
    <Layout title="Tools" description="Useful tools and calculators.">
      <main className="container margin-vert--lg">
        <h1>My Handy Tools</h1>
        <p>Here are some useful tools I've built:</p>

        <section className="calculator-section">
          <h2>Annual Mileage Calculator</h2>
          <AnnualMileageCalculator />
        </section>

        <section className="calculator-section margin-top--lg">
          <h2>Contraction Timer</h2>
          <ContractionTimer />
        </section>
      </main>
    </Layout>
  );
}
