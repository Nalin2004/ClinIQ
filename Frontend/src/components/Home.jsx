export default function Home() {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Clinical Intelligence.<span className="text-accent"> Simplified.</span></h1>
          <p className="hero-subtitle">Turning clinical trial chaos into actionable insight</p>
          <span className="home-scroll">Scroll to explore ↓</span>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="home-features">
        <div className="features-container">
          {/* FEATURE 1 */}
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>What is ClinIQ?</h3>
            <p>
              A digital intelligence platform designed to help research teams
              detect high-risk subjects, missing data, and compliance gaps
              in real time.
            </p>
          </div>

          {/* FEATURE 2 */}
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Why ClinIQ Exists</h3>
            <p>
              Clinical trials fail not due to lack of data but due to late detection
              of operational risk. ClinIQ identifies red flags before regulators do.
            </p>
          </div>

          {/* FEATURE 3 */}
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>How It Works</h3>
            <p>
              We convert fragmented clinical datasets into dynamic risk scores,
              real-time dashboards, AI-driven insights and follow-up prioritization.
            </p>
          </div>

          {/* FEATURE 4 */}
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Who Benefits?</h3>
            <p>
              Sponsors, investigators, monitors and patients —
              everyone gains clarity, safety and speed.
            </p>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="home-value">
        <div className="value-content">
          <h2>Why Choose ClinIQ?</h2>
          <div className="value-grid">
            <div className="value-item">
              <div className="value-number">01</div>
              <h4>Real-Time Monitoring</h4>
              <p>Get instant alerts on compliance issues and data anomalies</p>
            </div>
            <div className="value-item">
              <div className="value-number">02</div>
              <h4>AI-Powered Insights</h4>
              <p>Advanced analytics that identify patterns humans might miss</p>
            </div>
            <div className="value-item">
              <div className="value-number">03</div>
              <h4>Risk Prioritization</h4>
              <p>Focus on high-impact issues first with smart risk scoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-cta">
        <div className="cta-content">
          <h2>Welcome to the Future of Clinical Monitoring</h2>
          <p>Because patient safety cannot wait for spreadsheets.</p>
          <button className="cta-button">Get Started Today</button>
        </div>
      </section>

    </div>
  );
}
